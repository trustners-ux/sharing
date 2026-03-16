import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { FinancialPlanningData, FinancialHealthReport } from '@/types/financial-planning';
import { generateFullReport } from '@/lib/utils/financial-planning-calc';
import { generateClaudeNarrative } from '@/lib/utils/claude-narrative';
import { generateFinancialReport } from '@/lib/utils/financial-planning-pdf';
import { formatINR } from '@/lib/utils/formatters';
import { COMPANY } from '@/lib/constants/company';

export const maxDuration = 30;

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function buildReportEmailHTML(userName: string, score: number, grade: string, insights: string[]): string {
  const firstName = userName.split(' ')[0];
  const gradeColors: Record<string, string> = {
    'Excellent': '#15803d', 'Good': '#0f766e', 'Fair': '#d97706',
    'Needs Improvement': '#ea580c', 'Critical': '#b91c1c',
  };
  const gradeColor = gradeColors[grade] || '#0f766e';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
<tr><td style="background:linear-gradient(135deg,#0f766e,#134e4a);padding:24px 30px;text-align:center;">
<h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:700;">Trustner Financial Health Report</h1>
<p style="color:#99f6e4;margin:6px 0 0;font-size:13px;">Your personalized financial wellness assessment is ready</p></td></tr>
<tr><td style="padding:30px;">
<p style="color:#334155;font-size:15px;margin:0 0 20px;">Dear ${firstName},</p>
<p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">Thank you for completing the Trustner Financial Wellness Assessment. Your detailed 10-page report is attached as a PDF.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
<tr><td style="background:#f0fdfa;border:2px solid #99f6e4;border-radius:12px;padding:20px;text-align:center;">
<p style="color:#64748b;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px;">Your Financial Health Score</p>
<p style="color:${gradeColor};font-size:42px;font-weight:800;margin:0;line-height:1;">${score}</p>
<p style="color:#94a3b8;font-size:13px;margin:4px 0 12px;">out of 900</p>
<span style="display:inline-block;background:${gradeColor};color:#ffffff;padding:4px 16px;border-radius:20px;font-size:13px;font-weight:600;">${grade}</span>
</td></tr></table>
${insights.length > 0 ? `<p style="color:#334155;font-size:14px;font-weight:600;margin:0 0 12px;">Key Insights:</p>
${insights.map(i => `<p style="color:#475569;font-size:13px;line-height:1.5;margin:0 0 8px;padding-left:16px;border-left:3px solid #0f766e;">${i}</p>`).join('')}` : ''}
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="text-align:center;">
<p style="color:#475569;font-size:13px;margin:0 0 12px;">Ready to turn insights into action?</p>
<a href="tel:+916003903737" style="display:inline-block;background:#0f766e;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Talk to a Trustner Advisor</a>
<p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">or call ${COMPANY.contact.phoneDisplay}</p></td></tr></table>
<p style="color:#64748b;font-size:12px;line-height:1.5;margin:20px 0 0;padding-top:16px;border-top:1px solid #e2e8f0;">Your detailed 10-page Financial Health Report is attached as a PDF. Save it for your records.</p>
</td></tr>
<tr><td style="background:#f8fafc;padding:20px 30px;border-top:1px solid #e2e8f0;">
<p style="color:#94a3b8;font-size:11px;margin:0 0 4px;text-align:center;">${COMPANY.mfEntity.name} | ${COMPANY.mfEntity.amfiArn} | CIN: ${COMPANY.mfEntity.cin}</p>
<p style="color:#cbd5e1;font-size:10px;margin:0;text-align:center;">Mutual fund investments are subject to market risks. This assessment is for educational purposes only.</p>
</td></tr></table></body></html>`;
}

function buildTeamNotificationHTML(
  userName: string, userEmail: string, userPhone: string,
  report: Omit<FinancialHealthReport, 'claudeNarrative'>, data: FinancialPlanningData
): string {
  const score = report.score;
  const actions = report.actionPlan.slice(0, 3);
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;margin:0;padding:20px;background:#f8fafc;">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
<div style="background:#0f766e;padding:16px 20px;"><h2 style="color:#fff;margin:0;font-size:16px;">Financial Planning Lead</h2></div>
<div style="padding:20px;">
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;color:#1e293b;font-size:13px;">${userName}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Email</td><td style="padding:6px 0;color:#1e293b;font-size:13px;">${userEmail}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Phone</td><td style="padding:6px 0;color:#1e293b;font-size:13px;">${userPhone || 'Not provided'}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Score</td><td style="padding:6px 0;font-weight:700;color:#0f766e;font-size:16px;">${score.totalScore}/900 (${score.grade})</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Net Worth</td><td style="padding:6px 0;color:#1e293b;font-size:13px;">${formatINR(report.netWorth.netWorth)}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Age / City</td><td style="padding:6px 0;color:#1e293b;font-size:13px;">${data.personalProfile.age || '-'} / ${data.personalProfile.city || '-'}</td></tr>
<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Risk Profile</td><td style="padding:6px 0;color:#1e293b;font-size:13px;">${data.riskProfile.riskCategory || '-'}</td></tr>
</table>
<h3 style="color:#334155;font-size:13px;margin:16px 0 8px;">Pillar Breakdown:</h3>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:4px 0;font-size:12px;color:#64748b;">Cashflow</td><td style="padding:4px 0;font-size:12px;font-weight:600;">${score.pillars.cashflow.score}/180 (${score.pillars.cashflow.grade})</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#64748b;">Protection</td><td style="padding:4px 0;font-size:12px;font-weight:600;">${score.pillars.protection.score}/180 (${score.pillars.protection.grade})</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#64748b;">Investments</td><td style="padding:4px 0;font-size:12px;font-weight:600;">${score.pillars.investments.score}/180 (${score.pillars.investments.grade})</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#64748b;">Debt</td><td style="padding:4px 0;font-size:12px;font-weight:600;">${score.pillars.debt.score}/180 (${score.pillars.debt.grade})</td></tr>
<tr><td style="padding:4px 0;font-size:12px;color:#64748b;">Retirement</td><td style="padding:4px 0;font-size:12px;font-weight:600;">${score.pillars.retirementReadiness.score}/180 (${score.pillars.retirementReadiness.grade})</td></tr>
</table>
${actions.length > 0 ? `<h3 style="color:#334155;font-size:13px;margin:16px 0 8px;">Top Actions:</h3>
${actions.map((a, i) => `<p style="font-size:12px;margin:4px 0;color:#475569;">${i + 1}. [${a.impact}] ${a.action}</p>`).join('')}` : ''}
<p style="color:#94a3b8;font-size:11px;margin:16px 0 0;padding-top:12px;border-top:1px solid #e2e8f0;">
Report sent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
</div></div></body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, userName, userEmail } = body as {
      data: FinancialPlanningData; userName: string; userEmail: string;
    };

    if (!data || !userName || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[Generate Report] Starting for ${userName} (${userEmail})`);

    // Step 1: Generate full report (without narrative)
    const baseReport = generateFullReport(data);
    console.log(`[Generate Report] Score: ${baseReport.score.totalScore}/900 (${baseReport.score.grade})`);

    // Step 2: Generate Claude narrative (with fallback)
    const narrative = await generateClaudeNarrative(baseReport, data, userName);
    const report: FinancialHealthReport = { ...baseReport, claudeNarrative: narrative };
    console.log(`[Generate Report] Narrative generated (${narrative.length} chars)`);

    // Step 3: Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = generateFinancialReport(report, data, userName);
      console.log(`[Generate Report] PDF generated (${(pdfBuffer.length / 1024).toFixed(0)}KB)`);
    } catch (pdfError) {
      console.error('[Generate Report] PDF generation failed:', pdfError);
      await sendFallbackEmail(userName, userEmail, report);
      return NextResponse.json({ success: true, note: 'PDF failed, sent text email' });
    }

    // Step 4: Send report email to user
    const insights = [
      report.score.pillars.cashflow.keyInsight,
      report.score.pillars.protection.keyInsight,
      report.score.pillars.investments.keyInsight,
    ];

    try {
      await getResend().emails.send({
        from: 'Mera SIP Online <leads@merasip.com>',
        to: userEmail,
        subject: `Your Trustner Financial Health Report - Score: ${report.score.totalScore}/900`,
        html: buildReportEmailHTML(userName, report.score.totalScore, report.score.grade, insights),
        attachments: [{ filename: 'Trustner-Financial-Health-Report.pdf', content: pdfBuffer.toString('base64') }],
      });
      console.log(`[Generate Report] Report email sent to ${userEmail}`);
    } catch (emailError) {
      console.error('[Generate Report] User email failed:', emailError);
    }

    // Step 5: Send team notification
    try {
      const phone = data.personalProfile.phone || '';
      await getResend().emails.send({
        from: 'Mera SIP Online <leads@merasip.com>',
        to: 'wecare@merasip.com',
        subject: `[Financial Planning Lead] ${userName} - Score: ${report.score.totalScore}/900`,
        html: buildTeamNotificationHTML(userName, userEmail, phone, report, data),
      });
      console.log('[Generate Report] Team notification sent');
    } catch (teamError) {
      console.error('[Generate Report] Team notification failed:', teamError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Generate Report] Critical error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}

async function sendFallbackEmail(userName: string, userEmail: string, report: FinancialHealthReport) {
  const firstName = userName.split(' ')[0];
  try {
    await getResend().emails.send({
      from: 'Mera SIP Online <leads@merasip.com>',
      to: userEmail,
      subject: `Your Trustner Financial Health Score: ${report.score.totalScore}/900`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
<h2 style="color:#0f766e;">Hi ${firstName},</h2>
<p>Thank you for completing the Trustner Financial Wellness Assessment.</p>
<p style="font-size:24px;font-weight:bold;color:#0f766e;">Your Score: ${report.score.totalScore}/900 (${report.score.grade})</p>
<p>We encountered an issue generating your detailed PDF report. Our team has been notified and will send your complete report shortly.</p>
<p>Feel free to reach us at <strong>${COMPANY.contact.phoneDisplay}</strong> or visit <strong>merasip.com</strong>.</p>
<p style="color:#94a3b8;font-size:12px;margin-top:20px;">${COMPANY.mfEntity.name} | ${COMPANY.mfEntity.amfiArn}</p></div>`,
    });
  } catch (err) {
    console.error('[Generate Report] Fallback email also failed:', err);
  }
}
