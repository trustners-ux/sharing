import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  getReportEntry,
  updateReportEntry,
  getReportPdf,
  getReportPlanningData,
  updateReportPdf,
} from '@/lib/admin/report-queue-store';
import { buildReportEmailHTML } from '@/lib/utils/report-email-builders';
import { generateFinancialReport } from '@/lib/utils/financial-planning-pdf';
import { generateFullReport } from '@/lib/utils/financial-planning-calc';
import type { EditHistoryEntry } from '@/types/report-queue';
import type { FinancialHealthReport } from '@/types/financial-planning';

export const maxDuration = 30;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

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

    // Prevent double-sending
    if (entry.status === 'sent') {
      return NextResponse.json({ error: 'Report already sent' }, { status: 409 });
    }

    let pdfBuffer: Buffer | null = null;

    // If narrative was edited, regenerate PDF with the edited narrative
    if (entry.editedNarrative) {
      console.log(`[Approve] Regenerating PDF with edited narrative for ${id}`);
      const planningData = await getReportPlanningData(id);
      if (planningData) {
        const baseReport = generateFullReport(planningData);
        const fullReport: FinancialHealthReport = {
          ...baseReport,
          claudeNarrative: entry.editedNarrative,
        };
        pdfBuffer = generateFinancialReport(fullReport, planningData, entry.userName);
        // Upload new PDF
        const newPdfUrl = await updateReportPdf(id, pdfBuffer);
        await updateReportEntry(id, { pdfBlobUrl: newPdfUrl });
        console.log(`[Approve] New PDF uploaded for ${id}`);
      }
    }

    // Fetch the PDF (either new or original)
    if (!pdfBuffer) {
      pdfBuffer = await getReportPdf(id);
    }

    if (!pdfBuffer) {
      return NextResponse.json({ error: 'PDF not found — cannot send report' }, { status: 500 });
    }

    // Send report email to user
    const narrative = entry.editedNarrative || entry.claudeNarrative;
    const insights = entry.topActions.slice(0, 3);

    await getResend().emails.send({
      from: 'Mera SIP Online <leads@merasip.com>',
      to: entry.userEmail,
      subject: `Your Trustner Financial Health Report - Score: ${entry.totalScore}/900`,
      html: buildReportEmailHTML(entry.userName, entry.totalScore, entry.grade, insights),
      attachments: [{
        filename: 'Trustner-Financial-Health-Report.pdf',
        content: pdfBuffer.toString('base64'),
      }],
    });
    console.log(`[Approve] Report email sent to ${entry.userEmail}`);

    // Update entry status
    const historyEntry: EditHistoryEntry = {
      timestamp: new Date().toISOString(),
      adminEmail,
      action: 'approved',
      details: `Report approved and sent to ${entry.userEmail}`,
    };

    await updateReportEntry(id, {
      status: 'sent',
      approvedAt: new Date().toISOString(),
      approvedBy: adminEmail,
      sentAt: new Date().toISOString(),
      editHistory: [...entry.editHistory, historyEntry],
    });

    return NextResponse.json({ success: true, message: 'Report approved and sent' });
  } catch (error) {
    console.error('[Approve] Error:', error);
    return NextResponse.json({ error: 'Failed to approve and send report' }, { status: 500 });
  }
}
