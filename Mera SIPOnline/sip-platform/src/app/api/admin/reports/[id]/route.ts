import { NextRequest, NextResponse } from 'next/server';
import { getReportEntry, updateReportEntry } from '@/lib/admin/report-queue-store';
import type { EditHistoryEntry } from '@/types/report-queue';

// GET /api/admin/reports/[id] — Get single report
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await getReportEntry(id);
    if (!entry) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json({ report: entry });
  } catch (error) {
    console.error('[Admin Reports] Get error:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

// PATCH /api/admin/reports/[id] — Update narrative text (save draft)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { editedNarrative } = body as { editedNarrative: string };
    const adminEmail = request.headers.get('x-admin-email') || 'unknown';

    if (!editedNarrative || editedNarrative.trim().length === 0) {
      return NextResponse.json({ error: 'Narrative text is required' }, { status: 400 });
    }

    const entry = await getReportEntry(id);
    if (!entry) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const historyEntry: EditHistoryEntry = {
      timestamp: new Date().toISOString(),
      adminEmail,
      action: 'narrative_edited',
      details: `Narrative edited (${editedNarrative.length} chars)`,
    };

    const updated = await updateReportEntry(id, {
      editedNarrative,
      narrativeVersion: entry.narrativeVersion + 1,
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminEmail,
      editHistory: [...entry.editHistory, historyEntry],
    });

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error('[Admin Reports] Patch error:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
