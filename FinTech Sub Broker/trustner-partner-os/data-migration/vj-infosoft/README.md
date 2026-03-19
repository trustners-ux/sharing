# VJ Infosoft Data Migration

## Data Sources (trustner.co.in/backend/)

### 1. GI Policy Register (COMPLETED)
- **Source**: `ReportInsurancePolicyRegister.aspx`
- **Date Range**: 01-Jan-2020 to 13-Mar-2026
- **Records**: 1,672 policies
- **Columns**: SR NO, Policy No, Company, Insured Name, From, To, POS Name, Branch Name, Insurance Type, Sum Insured, Basic/OD Premium, TP Premium, NetPremium, GST, Final Premium
- **Export**: Excel export from VJ Infosoft UI + CSV via browser blob
- **File**: `vj_infosoft_gi_policy_register.csv` (in user Downloads)

### 2. Client Master (COMPLETED - scraped)
- **Source**: `AdminClientBasicInformation.aspx`
- **Records**: 1,431 unique clients (72 pages x 21 records/page)
- **Columns**: Client ID, Name, Group Head, Email, MobileNo
- **Storage**: Browser localStorage key `clientScrapeData` (JSON array)
- **CSV**: Browser localStorage key `clientScrapeCSV` (105KB)
- **File**: `vj_infosoft_client_master.csv` (in user Downloads)
- **To extract again**: Run on VJ Infosoft page:
  ```js
  var csv = localStorage.getItem('clientScrapeCSV');
  var blob = new Blob([csv], { type: 'text/csv' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vj_infosoft_client_master.csv';
  a.click();
  ```

### 3. POS/Agent Master (COMPLETED)
- **Source**: `UserPOSMasterAddEdit.aspx`
- **Records**: 147 POS agents
- **Columns**: Index, Name, Email Id, Mobile Number, GST Number, PAN No, City, User Name, Password, Status
- **Storage**: Browser localStorage key `posScrapeData` / `posScrapeCSV`
- **File**: `vj_infosoft_pos_master.csv` (in user Downloads, 11.6KB)

### 4. GI Brokerage/Commission - POS Payout Report (COMPLETED)
- **Source**: `ReportBACombinePayout.aspx` (POS Pay Out Report)
- **Date Range**: 01-Jan-2020 to 13-Mar-2026
- **Records**: 1,046 payout entries
- **Columns** (38 total): Unique No, Login Date, Policy Start/End Date, Policy Installment Date, POS Name, Policy No, Customer Name, Age, Company Name, Insurance Type, Product, Branch Name, Insurance Branch, RM Name, Policy Type, Reg No, Make, Model, Fuel, CC, NCB, GVW, Disc %, Sum Insured, OD Premium, TP Premium, Net Premium, Gross Premium, Base OF POS, Commissionable POS, POS Payable %, POS Payable Sharing %, POS Payable Amount, Terrorism Premium, Terrorism %, Terrorism Brokerage, Type
- **Storage**: Browser localStorage key `posPayoutData` / `posPayoutCSV`
- **File**: `vj_infosoft_pos_payout_report.csv` (in user Downloads, 403KB)

### 5. Renewal Due Report (COMPLETED)
- **Source**: `ReportInsuranceDue.aspx`
- **Date Range**: 01-Jan-2020 to 31-Dec-2026
- **Records**: 976 renewal entries
- **Columns** (40 total): SR NO, Unique ID, Month, Login Date, Risk Start, End Date, Policy No, Insurance Branch, POS Name, Branch Name, Insured Name, ContNo, Email, Ins. Co., Insurance Type, Product Name, Make, Model, Reg. No, SA, Basic/OD, TP, Net Premium, GST, Total, New SA, New Premium, NCBPer., Payment Mode, CH.No, Ch. Date, Bank Name, Ch. Amt., Remarks, STATUS, RM Name, ZSM Name, TC Name, BQP Name, Ref Name
- **Storage**: Browser localStorage key `renewalDueData` / `renewalDueCSV`
- **File**: `vj_infosoft_renewal_due_report.csv` (in user Downloads, 422KB)

## Data Summary
| Dataset | Records | Columns | Size |
|---------|---------|---------|------|
| GI Policy Register | 1,672 | 15 | ~150KB |
| Client Master | 1,431 | 5 | 105KB |
| POS/Agent Master | 147 | 10 | 11.6KB |
| POS Payout Report | 1,046 | 38 | 403KB |
| Renewal Due Report | 976 | 40 | 422KB |
| **Total** | **5,272** | - | **~1.1MB** |

## VJ Infosoft URLs Reference
- Dashboard: `AdminDashboard.aspx`
- Client Master: `AdminClientBasicInformation.aspx`
- POS Master: `UserPOSMasterAddEdit.aspx`
- RM Master: `UserRMMasterAddEdit.aspx`
- ZSM Master: `UserZSMMasterAddEdit.aspx`
- Branch Master: `BranchMasterAddEdit.aspx`
- Policy Register: `ReportInsurancePolicyRegister.aspx`
- Business Summary: `ReportBusinessSummary.aspx`
- New/Renew Business: `ReportNewRenewBusiness.aspx`
- POS Dept Wise: `ReportBADepartmentWise.aspx`
- Endorsement Report: `ReportEndoresment.aspx`
- Renewal Due: `ReportInsuranceDue.aspx`
- Pending Renewal: `ReportPendingForRenewal.aspx`
- Renewal Followup: `ReportRenewalFollowup.aspx`
- New Client Report: `ReportNewClient.aspx`
- Client Credit/Debit: `ReportClientCreditDebit.aspx`
- POS Payout: `ReportBACombinePayout.aspx`
- REF Payout: `ReportRefCombinePayout.aspx`
- Client Portfolio: `ReportClientPortfolio.aspx`

## Date Format
VJ Infosoft uses `DD-MMM-YYYY` format (e.g., `01-Jan-2020`) via pickadate.js.
Pagination uses ASP.NET `__doPostBack('repViewData','Page$N')`.
