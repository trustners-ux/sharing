import { NextRequest, NextResponse } from 'next/server';
import {
  getReportEntry,
  updateReportEntry,
  getReportPlanningData,
  updateReportPdf,
} from '@/lib/admin/report-queue-store';
import { generateClaudeNarrative } from '@/lib/utils/claude-narrative';
import { generateFinancialReport } from '@/lib/utils/financial-planning-pdf';
import { generateFullReport } from '@/lib/utils/financial-planning-calc';
import type { EditHistoryEntry } from '@/types/report-queue';
import type { FinancialHealthReport } from '@/types/financial-planning';

export const maxDuration = 30;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminEmail = request.headers.get('x-admin-email') || 'unknown';

    const entry = await getReportEntry(id);
    if (!entry) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (entry.status === 'sent') {
      return NextResponse.json({ error: 'Cannot regenerate — report already sent' }, { status: 409 });
    }

    // Fetch original planning data from Blob
    const planningData = await getReportPlanningData(id);
    if (!planningData) {
      return NextResponse.json({ error: 'Planning data not found for regeneration' }, { status: 500 });
    }

    // Regenerate: calc → Claude narrative → PDF
    const baseReport = generateFullReport(planningData);
    const newNarrative = await generateClaudeNarrative(baseReport, planningData, entry.userName);

    const fullReport: FinancialHealthReport = {
      ...baseReport,
      claudeNarrative: newNarrative,
    };

    const pdfBuffer = generateFinancialReport(fullReport, planningData, entry.userName);
    const newPdfUrl = await updateReportPdf(id, pdfBuffer);

    console.log(`[Regenerate] New narrative + PDF for ${id} (${newNarrative.length} chars, ${(pdfBuffer.length / 1024).toFixed(0)}KB)`);

    const historyEntry: EditHistoryEntry = {
      timestamp: new Date().toISOString(),
      adminEmail,
      action: 'narrative_regenerated',
      details: `AI narrative regenerated (${newNarrative.length} chars)`,
    };

    await updateReportEntry(id, {
      claudeNarrative: newNarrative,
      editedNarrative: null, // Clear any manual edits
      narrativeVersion: entry.narrativeVersion + 1,
      pdfBlobUrl: newPdfUrl,
      reviewedAt: new Date().toISOString(),
      reviewedBy: adminEmail,
      editHistory: [...entry.editHistory, historyEntry],
    });

    return NextResponse.json({
      success: true,
      narrative: newNarrative,
      narrativeVersion: entry.narrativeVersion + 1,
    });
  } catch (error) {
    console.error('[Regenerate] Error:', error);
    return NextResponse.json({ error: 'Failed to regenerate report' }, { status: 500 });
  }
}
