"""MIS Data Router — centralised Supabase storage for MIS imports."""

import os
import logging
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/mis", tags=["MIS Data"])

BATCH_SIZE = 500  # Max rows per Supabase insert to avoid timeouts


# ---------------------------------------------------------------------------
# Supabase client (service key — bypasses RLS)
# ---------------------------------------------------------------------------

def get_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise HTTPException(
            status_code=500,
            detail="SUPABASE_URL or SUPABASE_SERVICE_KEY not configured",
        )
    return create_client(url, key)


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class MISImportRequest(BaseModel):
    month: str
    year: str
    fileName: Optional[str] = None
    gi: List[Dict[str, Any]] = []
    health: List[Dict[str, Any]] = []
    life: List[Dict[str, Any]] = []
    mf: List[Dict[str, Any]] = []
    mtd: List[Dict[str, Any]] = []


class MISImportResponse(BaseModel):
    import_id: str
    gi_count: int
    health_count: int
    life_count: int
    mf_count: int
    mtd_count: int


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _camel_to_snake(name: str) -> str:
    """Convert camelCase to snake_case."""
    import re
    s1 = re.sub(r'([A-Z])', r'_\1', name)
    return s1.lower().lstrip('_')


# Map frontend camelCase keys to Supabase snake_case columns per table
_FIELD_MAP = {
    "mis_gi": {
        "slNo": "sl_no", "entryDate": "entry_date", "customerName": "customer_name",
        "contactNo": "contact_no", "policyNo": "policy_no", "referredBy": "referred_by",
        "businessClosedBy": "business_closed_by", "pospName": "posp_name",
        "policyType": "policy_type", "motorPolicyType": "motor_policy_type",
        "subType": "sub_type", "fromDate": "from_date", "toDate": "to_date",
        "odPremium": "od_premium", "tpPremium": "tp_premium", "netPremium": "net_premium",
        "issuedDate": "issued_date", "agencyBroker": "agency_broker",
        "employeeLocation": "employee_location",
    },
    "mis_health": {
        "customerName": "customer_name", "refNo": "ref_no", "paymentDate": "payment_date",
        "advisorName": "advisor_name", "loginMode": "login_mode",
        "paymentMethod": "payment_method", "givenBy": "given_by",
        "businessClosedBy": "business_closed_by", "pospName": "posp_name",
        "companyName": "company_name", "creditPercent": "credit_percent",
        "issuedDate": "issued_date", "employeeLocation": "employee_location",
    },
    "mis_life": {
        "customerName": "customer_name", "advisorName": "advisor_name",
        "givenBy": "given_by", "closedBy": "closed_by", "pospName": "posp_name",
        "policyNo": "policy_no", "basePremium": "base_premium",
        "totalPremium": "total_premium", "paymentType": "payment_type",
        "sumAssured": "sum_assured", "paymentMode": "payment_mode",
        "cashOnline": "cash_online", "issuedDate": "issued_date",
        "isDirect": "is_direct", "creditPct": "credit_pct",
    },
    "mis_mf": {
        "slNo": "sl_no", "transactionDate": "transaction_date",
        "canPanNo": "can_pan_no", "clientType": "client_type",
        "clientName": "client_name", "txnType": "txn_type",
        "txnSubType": "txn_sub_type", "folioNumber": "folio_number",
        "schemeName": "scheme_name", "sipDate": "sip_date",
    },
    "mis_mtd": {
        "ftdNewCall": "ftd_new_call", "ftdFollowUp": "ftd_follow_up",
        "totalBusiness": "total_business",
    },
}


def _convert_row(row: dict, table: str) -> dict:
    """Convert a frontend row (camelCase) to Supabase row (snake_case)."""
    field_map = _FIELD_MAP.get(table, {})
    converted = {}
    for key, value in row.items():
        # Skip internal fields
        if key in ("id", "import_id"):
            continue
        # Use explicit map first, then auto-convert
        new_key = field_map.get(key, _camel_to_snake(key))
        converted[new_key] = value
    return converted


def _batch_insert(supabase, table: str, rows: List[dict], import_id: str):
    """Insert rows in batches of BATCH_SIZE, attaching import_id to each row."""
    if not rows:
        return
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        converted_batch = []
        for row in batch:
            converted = _convert_row(row, table)
            converted["import_id"] = import_id
            converted_batch.append(converted)
        supabase.table(table).insert(converted_batch).execute()


def _snake_to_camel(name: str) -> str:
    """Convert snake_case to camelCase."""
    parts = name.split('_')
    return parts[0] + ''.join(p.capitalize() for p in parts[1:])


def _convert_rows_to_camel(rows: list) -> list:
    """Convert Supabase snake_case rows to camelCase for the frontend."""
    result = []
    for row in rows:
        converted = {}
        for key, value in row.items():
            if key in ("id", "import_id"):
                continue  # Strip internal IDs
            converted[_snake_to_camel(key)] = value
        result.append(converted)
    return result


def _fetch_import_data(supabase, import_id: str) -> dict:
    """Fetch all data tables for a given import_id."""
    gi = supabase.table("mis_gi").select("*").eq("import_id", import_id).execute()
    health = supabase.table("mis_health").select("*").eq("import_id", import_id).execute()
    life = supabase.table("mis_life").select("*").eq("import_id", import_id).execute()

    # MF can be large — paginate with range to fetch all rows
    mf_rows: list = []
    page = 0
    while True:
        start = page * 1000
        end = start + 999
        chunk = (
            supabase.table("mis_mf")
            .select("*")
            .eq("import_id", import_id)
            .range(start, end)
            .execute()
        )
        mf_rows.extend(chunk.data)
        if len(chunk.data) < 1000:
            break
        page += 1

    mtd = supabase.table("mis_mtd").select("*").eq("import_id", import_id).execute()

    return {
        "gi": _convert_rows_to_camel(gi.data),
        "health": _convert_rows_to_camel(health.data),
        "life": _convert_rows_to_camel(life.data),
        "mf": _convert_rows_to_camel(mf_rows),
        "mtd": _convert_rows_to_camel(mtd.data),
    }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/import", response_model=MISImportResponse)
async def import_mis_data(payload: MISImportRequest):
    """
    Import MIS data for a given month/year.
    If data already exists for that month+year it is replaced (upsert).
    """
    try:
        sb = get_supabase()

        # Check if an import already exists for this month+year
        existing = (
            sb.table("mis_imports")
            .select("id")
            .eq("month", payload.month)
            .eq("year", payload.year)
            .execute()
        )

        # Delete old import if it exists (CASCADE removes child rows)
        if existing.data:
            old_id = existing.data[0]["id"]
            sb.table("mis_imports").delete().eq("id", old_id).execute()

        # Create new import record
        import_record = {
            "month": payload.month,
            "year": payload.year,
            "file_name": payload.fileName,
            "gi_count": len(payload.gi),
            "health_count": len(payload.health),
            "life_count": len(payload.life),
            "mf_count": len(payload.mf),
            "mtd_count": len(payload.mtd),
        }
        result = sb.table("mis_imports").insert(import_record).execute()
        import_id = result.data[0]["id"]

        # Insert data into child tables (batched)
        _batch_insert(sb, "mis_gi", payload.gi, import_id)
        _batch_insert(sb, "mis_health", payload.health, import_id)
        _batch_insert(sb, "mis_life", payload.life, import_id)
        _batch_insert(sb, "mis_mf", payload.mf, import_id)
        _batch_insert(sb, "mis_mtd", payload.mtd, import_id)

        return MISImportResponse(
            import_id=import_id,
            gi_count=len(payload.gi),
            health_count=len(payload.health),
            life_count=len(payload.life),
            mf_count=len(payload.mf),
            mtd_count=len(payload.mtd),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("MIS import failed")
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")


@router.get("/data")
async def get_mis_data(month: str, year: str):
    """Return all MIS data for a given month/year."""
    try:
        sb = get_supabase()

        imp = (
            sb.table("mis_imports")
            .select("*")
            .eq("month", month)
            .eq("year", year)
            .execute()
        )

        if not imp.data:
            raise HTTPException(
                status_code=404,
                detail=f"No MIS data found for {month} {year}",
            )

        import_row = imp.data[0]
        data = _fetch_import_data(sb, import_row["id"])

        return {
            **data,
            "meta": import_row,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch MIS data")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/latest")
async def get_latest_mis_data():
    """Return the most recent MIS import and its data."""
    try:
        sb = get_supabase()

        imp = (
            sb.table("mis_imports")
            .select("*")
            .order("imported_at", desc=True)
            .limit(1)
            .execute()
        )

        if not imp.data:
            raise HTTPException(status_code=404, detail="No MIS imports found")

        import_row = imp.data[0]
        data = _fetch_import_data(sb, import_row["id"])

        return {
            **data,
            "meta": import_row,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch latest MIS data")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/imports")
async def list_imports():
    """Return metadata for all MIS imports (for month/year selector)."""
    try:
        sb = get_supabase()

        result = (
            sb.table("mis_imports")
            .select("*")
            .order("imported_at", desc=True)
            .execute()
        )

        return {"imports": result.data}

    except Exception as e:
        logger.exception("Failed to list MIS imports")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/import/{import_id}")
async def delete_import(import_id: str):
    """Delete an import and all its data (CASCADE)."""
    try:
        sb = get_supabase()

        # Verify import exists
        existing = (
            sb.table("mis_imports")
            .select("id")
            .eq("id", import_id)
            .execute()
        )
        if not existing.data:
            raise HTTPException(status_code=404, detail="Import not found")

        sb.table("mis_imports").delete().eq("id", import_id).execute()

        return {"status": "deleted", "import_id": import_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Failed to delete MIS import")
        raise HTTPException(status_code=500, detail=str(e))
