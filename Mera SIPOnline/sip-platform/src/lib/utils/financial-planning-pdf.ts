import { jsPDF } from 'jspdf';
import type { FinancialHealthReport, FinancialPlanningData, PillarScore } from '@/types/financial-planning';
import { COMPANY, DISCLAIMER } from '@/lib/constants/company';
import { formatINR } from '@/lib/utils/formatters';
import { LOGO_BASE64 } from '@/lib/constants/logo-base64';

// ─── Constants ───
const PW = 210; // A4 width mm
const PH = 297; // A4 height mm
const M = 12;   // margin
const CW = PW - M * 2; // content width
const HH = 16;  // header height
const FH = 12;  // footer height
const CSY = M + HH + 4; // content start Y
const TOTAL_PAGES = 10;

// ─── Colors ───
type RGB = [number, number, number];
const TEAL: RGB = [15, 118, 110];
const TEAL_LIGHT: RGB = [240, 253, 250];
const ORANGE: RGB = [232, 85, 58];
const S800: RGB = [30, 41, 59];
const S600: RGB = [71, 85, 105];
const S400: RGB = [148, 163, 184];
const S200: RGB = [226, 232, 240];
const S50: RGB = [248, 250, 252];
const WHITE: RGB = [255, 255, 255];
const RED: RGB = [185, 28, 28];
const AMBER: RGB = [217, 119, 6];
const GREEN: RGB = [21, 128, 61];
const BLUE: RGB = [29, 78, 216];
const PURPLE: RGB = [124, 58, 237];
const E50: RGB = [236, 253, 245];
const R50: RGB = [254, 242, 242];
const A50: RGB = [255, 251, 235];
const B50: RGB = [239, 246, 255];

const PILLAR_C: RGB[] = [TEAL, PURPLE, BLUE, ORANGE, AMBER];
const GRADE_C: Record<string, RGB> = {
  'Excellent': GREEN, 'Good': TEAL, 'Fair': AMBER, 'Needs Attention': ORANGE, 'Needs Improvement': ORANGE, 'Critical': RED,
};
const gc = (g: string): RGB => GRADE_C[g] || S600;

// ─── Shared Helpers ───
function hdr(p: jsPDF, pg: number, dt: string) {
  p.setFillColor(...TEAL); p.rect(0, 0, PW, HH, 'F');
  p.setFillColor(...ORANGE); p.rect(0, HH - 0.6, PW, 0.6, 'F');
  try { p.addImage(LOGO_BASE64, 'PNG', M, 2, 36, 12); } catch {
    p.setTextColor(255, 255, 255); p.setFontSize(9); p.setFont('helvetica', 'bold');
    p.text('TRUSTNER', M, 8);
  }
  p.setTextColor(204, 251, 241); p.setFontSize(7); p.setFont('helvetica', 'normal');
  p.text('Trustner Financial Health Report | merasip.com', M + 38, 8);
  p.setFontSize(6); p.text(`Page ${pg} of ${TOTAL_PAGES}`, PW - M, 7, { align: 'right' });
  p.setFontSize(5.5); p.text(`Generated: ${dt}`, PW - M, 10, { align: 'right' });
}

function ftr(p: jsPDF) {
  const y = PH - FH;
  p.setDrawColor(...TEAL); p.setLineWidth(0.2); p.line(M, y, PW - M, y);
  p.setTextColor(...S400); p.setFontSize(5); p.setFont('helvetica', 'normal');
  p.text(`${COMPANY.mfEntity.name} | ${COMPANY.mfEntity.type} | ${COMPANY.mfEntity.amfiArn} | CIN: ${COMPANY.mfEntity.cin}`, M, y + 3);
  p.setFontSize(4.5); p.text(DISCLAIMER.mutual_fund, M, y + 5.5);
  p.text('www.merasip.com', PW - M, y + 3, { align: 'right' });
}

function wm(p: jsPDF) {
  try {
    p.saveGraphicsState();
    const gs = (p as unknown as { GState: new (o: { opacity: number }) => unknown }).GState;
    p.setGState(new gs({ opacity: 0.03 }));
    p.addImage(LOGO_BASE64, 'PNG', PW / 2 - 30, PH / 2 - 15, 60, 30);
    p.restoreGraphicsState();
  } catch { /* decorative — skip */ }
}

function secTitle(p: jsPDF, y: number, t: string): number {
  p.setFillColor(...TEAL); p.roundedRect(M, y, CW, 10, 2, 2, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(11); p.setFont('helvetica', 'bold');
  p.text(t, M + 5, y + 7); return y + 14;
}

function progBar(p: jsPDF, x: number, y: number, w: number, h: number, v: number, mx: number, c: RGB) {
  p.setFillColor(...S200); p.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
  const fw = Math.max(0, Math.min(w, (v / mx) * w));
  if (fw > 0) { p.setFillColor(...c); p.roundedRect(x, y, fw, h, h / 2, h / 2, 'F'); }
}

function kvRow(p: jsPDF, y: number, l: string, v: string, lc: RGB = S600, vc: RGB = S800): number {
  p.setTextColor(...lc); p.setFontSize(7); p.setFont('helvetica', 'normal'); p.text(l, M + 4, y);
  p.setTextColor(...vc); p.setFontSize(7); p.setFont('helvetica', 'bold'); p.text(v, PW - M - 4, y, { align: 'right' });
  return y + 5;
}

// ─── Page 1: Cover ───
function p1(p: jsPDF, r: FinancialHealthReport, nm: string, dt: string) {
  hdr(p, 1, dt); wm(p);
  let y = 50;
  try { p.addImage(LOGO_BASE64, 'PNG', PW / 2 - 30, y, 60, 30); y += 38; } catch { y += 10; }

  p.setTextColor(...TEAL); p.setFontSize(22); p.setFont('helvetica', 'bold');
  p.text('Financial Health Report', PW / 2, y, { align: 'center' }); y += 10;
  p.setTextColor(...S600); p.setFontSize(12); p.setFont('helvetica', 'normal');
  p.text('Trustner Financial Wellness Assessment', PW / 2, y, { align: 'center' }); y += 15;

  p.setFillColor(...TEAL_LIGHT); p.roundedRect(M + 20, y, CW - 40, 14, 3, 3, 'F');
  p.setDrawColor(...TEAL); p.setLineWidth(0.3); p.roundedRect(M + 20, y, CW - 40, 14, 3, 3, 'S');
  p.setTextColor(...TEAL); p.setFontSize(13); p.setFont('helvetica', 'bold');
  p.text(`Prepared for: ${nm}`, PW / 2, y + 9, { align: 'center' }); y += 22;

  p.setTextColor(...S400); p.setFontSize(9); p.setFont('helvetica', 'normal');
  p.text(`Assessment Date: ${dt}`, PW / 2, y, { align: 'center' }); y += 20;

  // Score gauge
  const cx = PW / 2, cy = y + 35, rad = 35, seg = 60;
  const ratio = Math.min(r.score.totalScore / 900, 1);
  const gCol = gc(r.score.grade);

  p.setDrawColor(...S200); p.setLineWidth(6);
  for (let i = 0; i < seg; i++) {
    const a1 = Math.PI - (i / seg) * Math.PI, a2 = Math.PI - ((i + 1) / seg) * Math.PI;
    p.line(cx + rad * Math.cos(a1), cy - rad * Math.sin(a1), cx + rad * Math.cos(a2), cy - rad * Math.sin(a2));
  }
  const filled = Math.floor(ratio * seg);
  if (filled > 0) {
    p.setDrawColor(...gCol); p.setLineWidth(6);
    for (let i = 0; i < filled; i++) {
      const a1 = Math.PI - (i / seg) * Math.PI, a2 = Math.PI - ((i + 1) / seg) * Math.PI;
      p.line(cx + rad * Math.cos(a1), cy - rad * Math.sin(a1), cx + rad * Math.cos(a2), cy - rad * Math.sin(a2));
    }
  }

  p.setTextColor(...gCol); p.setFontSize(28); p.setFont('helvetica', 'bold');
  p.text(`${r.score.totalScore}`, cx, cy - 5, { align: 'center' });
  p.setTextColor(...S400); p.setFontSize(9); p.setFont('helvetica', 'normal');
  p.text('out of 900', cx, cy + 3, { align: 'center' });

  p.setFillColor(...gCol);
  const gw = p.getStringUnitWidth(r.score.grade) * 10 / p.internal.scaleFactor + 12;
  p.roundedRect(cx - gw / 2, cy + 7, gw, 8, 2, 2, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(10); p.setFont('helvetica', 'bold');
  p.text(r.score.grade, cx, cy + 13, { align: 'center' });

  p.setTextColor(...S400); p.setFontSize(6); p.setFont('helvetica', 'normal');
  p.text('0', cx - rad - 2, cy + 22, { align: 'center' });
  p.text('900', cx + rad + 2, cy + 22, { align: 'center' });

  const dy = PH - FH - 20;
  p.setFillColor(...S50); p.roundedRect(M + 10, dy, CW - 20, 12, 2, 2, 'F');
  p.setTextColor(...S400); p.setFontSize(6); p.setFont('helvetica', 'normal');
  const dl = p.splitTextToSize('This assessment is for educational purposes only. It does not constitute investment advice under SEBI regulations. Trustner Asset Services Pvt. Ltd. is an AMFI Registered MFD (ARN-286886).', CW - 28);
  p.text(dl, M + 14, dy + 5);
  ftr(p);
}

// ─── Page 2: Score Dashboard ───
function p2(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 2, dt); wm(p);
  let y = secTitle(p, CSY, 'Your Financial Health Dashboard');

  p.setFillColor(...TEAL_LIGHT); p.roundedRect(M, y, CW, 14, 2, 2, 'F');
  p.setTextColor(...TEAL); p.setFontSize(10); p.setFont('helvetica', 'bold');
  p.text(`Overall Score: ${r.score.totalScore}/900`, M + 5, y + 6);
  const gCol = gc(r.score.grade);
  p.setFillColor(...gCol); p.roundedRect(PW - M - 30, y + 2, 26, 8, 2, 2, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(8); p.text(r.score.grade, PW - M - 17, y + 8, { align: 'center' });
  y += 20;

  const pillars: [string, PillarScore, RGB][] = [
    ['Cashflow Health', r.score.pillars.cashflow, PILLAR_C[0]],
    ['Protection & Insurance', r.score.pillars.protection, PILLAR_C[1]],
    ['Investments', r.score.pillars.investments, PILLAR_C[2]],
    ['Debt Management', r.score.pillars.debt, PILLAR_C[3]],
    ['Retirement Readiness', r.score.pillars.retirementReadiness, PILLAR_C[4]],
  ];

  for (const [nm, pl, col] of pillars) {
    p.setFillColor(...S50); p.roundedRect(M, y, CW, 30, 2, 2, 'F');
    p.setDrawColor(...S200); p.setLineWidth(0.2); p.roundedRect(M, y, CW, 30, 2, 2, 'S');
    p.setTextColor(...col); p.setFontSize(10); p.setFont('helvetica', 'bold'); p.text(nm, M + 5, y + 8);
    p.setTextColor(...S800); p.setFontSize(9); p.text(`${pl.score}/${pl.maxScore}`, PW - M - 5, y + 8, { align: 'right' });

    const pgc = gc(pl.grade);
    p.setFillColor(...pgc); p.roundedRect(PW - M - 45, y + 2, 24, 7, 1.5, 1.5, 'F');
    p.setTextColor(255, 255, 255); p.setFontSize(6.5); p.text(pl.grade, PW - M - 33, y + 7, { align: 'center' });

    progBar(p, M + 5, y + 13, CW - 10, 4, pl.score, pl.maxScore, col);
    p.setTextColor(...S600); p.setFontSize(7); p.setFont('helvetica', 'normal');
    const il = p.splitTextToSize(pl.keyInsight, CW - 14); p.text(il.slice(0, 2), M + 5, y + 23);
    y += 34;
  }
  ftr(p);
}

// ─── Page 3: Net Worth ───
function p3(p: jsPDF, r: FinancialHealthReport, d: FinancialPlanningData, dt: string) {
  p.addPage(); hdr(p, 3, dt); wm(p);
  let y = secTitle(p, CSY, 'Net Worth Statement');
  const a = d.assetProfile, li = d.liabilityProfile;

  p.setTextColor(...TEAL); p.setFontSize(10); p.setFont('helvetica', 'bold'); p.text('Assets', M + 4, y + 5); y += 9;
  const aRows: [string, number][] = [
    ['Mutual Funds', a.mutualFunds || 0],
    ['Direct Equity / Stocks', a.stocks || 0], ['PPF / EPF', a.ppfEpf || 0], ['NPS', a.nps || 0],
    ['Fixed Deposits', a.fixedDeposits || 0], ['Gold / SGB', a.gold || 0],
    ['Real Estate (Non-residence)', a.realEstateInvestment || 0], ['Primary Residence', a.primaryResidenceValue || 0],
    ['Bank Savings', a.bankSavings || 0], ['Other Assets', a.otherAssets || 0],
  ];

  p.setFillColor(...TEAL); p.rect(M, y, CW, 6, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(6.5); p.setFont('helvetica', 'bold');
  p.text('Asset Class', M + 4, y + 4); p.text('Value', PW - M - 4, y + 4, { align: 'right' }); y += 6;

  for (let i = 0; i < aRows.length; i++) {
    const [l, v] = aRows[i]; if (v <= 0) continue;
    p.setFillColor(...(i % 2 === 0 ? S50 : WHITE)); p.rect(M, y, CW, 5.5, 'F');
    p.setTextColor(...S600); p.setFontSize(6.5); p.setFont('helvetica', 'normal'); p.text(l, M + 4, y + 4);
    p.setTextColor(...S800); p.setFont('helvetica', 'bold'); p.text(formatINR(v), PW - M - 4, y + 4, { align: 'right' }); y += 5.5;
  }
  p.setFillColor(...E50); p.rect(M, y, CW, 7, 'F');
  p.setTextColor(...GREEN); p.setFontSize(7.5); p.setFont('helvetica', 'bold');
  p.text('Total Assets', M + 4, y + 5); p.text(formatINR(r.netWorth.totalAssets), PW - M - 4, y + 5, { align: 'right' }); y += 14;

  p.setTextColor(...RED); p.setFontSize(10); p.setFont('helvetica', 'bold'); p.text('Liabilities', M + 4, y + 5); y += 9;
  const lRows: [string, number][] = [
    ['Home Loan', li.homeLoan?.outstanding || 0], ['Car Loan', li.carLoan?.outstanding || 0],
    ['Personal Loan', li.personalLoan?.outstanding || 0], ['Education Loan', li.educationLoan?.outstanding || 0],
    ['Credit Card', li.creditCardDebt || 0], ['Other Loans', li.otherLoans || 0],
  ];

  p.setFillColor(...RED); p.rect(M, y, CW, 6, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(6.5); p.setFont('helvetica', 'bold');
  p.text('Liability', M + 4, y + 4); p.text('Outstanding', PW - M - 4, y + 4, { align: 'right' }); y += 6;

  let hasLiab = false;
  for (let i = 0; i < lRows.length; i++) {
    const [l, v] = lRows[i]; if (v <= 0) continue; hasLiab = true;
    p.setFillColor(...(i % 2 === 0 ? S50 : WHITE)); p.rect(M, y, CW, 5.5, 'F');
    p.setTextColor(...S600); p.setFontSize(6.5); p.setFont('helvetica', 'normal'); p.text(l, M + 4, y + 4);
    p.setTextColor(...S800); p.setFont('helvetica', 'bold'); p.text(formatINR(v), PW - M - 4, y + 4, { align: 'right' }); y += 5.5;
  }
  if (!hasLiab) {
    p.setFillColor(...E50); p.rect(M, y, CW, 5.5, 'F');
    p.setTextColor(...GREEN); p.setFontSize(6.5); p.setFont('helvetica', 'normal');
    p.text('No outstanding liabilities — debt free!', M + 4, y + 4); y += 5.5;
  }
  p.setFillColor(...R50); p.rect(M, y, CW, 7, 'F');
  p.setTextColor(...RED); p.setFontSize(7.5); p.setFont('helvetica', 'bold');
  p.text('Total Liabilities', M + 4, y + 5); p.text(formatINR(r.netWorth.totalLiabilities), PW - M - 4, y + 5, { align: 'right' }); y += 14;

  const nwc = r.netWorth.netWorth >= 0 ? GREEN : RED;
  const nwBg = r.netWorth.netWorth >= 0 ? E50 : R50;
  p.setFillColor(...nwBg); p.roundedRect(M, y, CW, 18, 3, 3, 'F');
  p.setDrawColor(...nwc); p.setLineWidth(0.5); p.roundedRect(M, y, CW, 18, 3, 3, 'S');
  p.setTextColor(...nwc); p.setFontSize(12); p.setFont('helvetica', 'bold'); p.text('NET WORTH', M + 8, y + 8);
  p.setFontSize(16); p.text(formatINR(r.netWorth.netWorth), PW - M - 8, y + 12, { align: 'right' });
  ftr(p);
}

// ─── Page 4: Retirement ───
function p4(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 4, dt); wm(p);
  let y = secTitle(p, CSY, 'Retirement Readiness Analysis');
  const g = r.retirementGap;

  const mets = [
    { l: 'Required Corpus', v: formatINR(g.requiredCorpus), c: S800 },
    { l: 'Current Progress', v: formatINR(g.currentProgress), c: TEAL },
    { l: 'Gap Amount', v: g.gap > 0 ? formatINR(g.gap) : 'On Track!', c: g.gap > 0 ? RED : GREEN },
    { l: 'Years to Retirement', v: `${g.yearsToRetirement} years`, c: BLUE },
  ];
  const bw = (CW - 6) / 2;
  for (let i = 0; i < mets.length; i++) {
    const col = i % 2, row = Math.floor(i / 2);
    const bx = M + col * (bw + 6), by = y + row * 22;
    p.setFillColor(...S50); p.roundedRect(bx, by, bw, 18, 2, 2, 'F');
    p.setDrawColor(...S200); p.setLineWidth(0.2); p.roundedRect(bx, by, bw, 18, 2, 2, 'S');
    p.setTextColor(...S400); p.setFontSize(7); p.setFont('helvetica', 'normal'); p.text(mets[i].l, bx + 5, by + 6);
    p.setTextColor(...mets[i].c); p.setFontSize(12); p.setFont('helvetica', 'bold'); p.text(mets[i].v, bx + 5, by + 14);
  }
  y += 50;

  p.setTextColor(...S800); p.setFontSize(9); p.setFont('helvetica', 'bold'); p.text('Required vs Current Progress', M + 4, y); y += 6;
  const mx = Math.max(g.requiredCorpus, g.currentProgress, 1);
  p.setTextColor(...S600); p.setFontSize(7); p.setFont('helvetica', 'normal');
  p.text('Required', M + 4, y + 4); progBar(p, M + 30, y, CW - 34, 5, g.requiredCorpus, mx, S600); y += 10;
  p.text('Current', M + 4, y + 4); progBar(p, M + 30, y, CW - 34, 5, g.currentProgress, mx, TEAL); y += 15;

  if (g.monthlyToClose > 0) {
    p.setFillColor(...A50); p.roundedRect(M, y, CW, 16, 2, 2, 'F');
    p.setDrawColor(...AMBER); p.setLineWidth(0.3); p.roundedRect(M, y, CW, 16, 2, 2, 'S');
    p.setTextColor(...AMBER); p.setFontSize(8); p.setFont('helvetica', 'bold');
    p.text('Monthly SIP Needed to Bridge Gap', M + 5, y + 6);
    p.setFontSize(14); p.text(formatINR(g.monthlyToClose) + ' / month', M + 5, y + 13); y += 22;
  }

  y += 5;
  p.setFillColor(...S50); p.roundedRect(M, y, CW, 18, 2, 2, 'F');
  p.setTextColor(...S400); p.setFontSize(6); p.setFont('helvetica', 'normal');
  ['Assumptions: Inflation 6% p.a. | Life expectancy 85 years | Real return 3% post-retirement',
   'Projected growth: EPF/NPS at 8% CAGR, MF at 10% CAGR | Corpus calculated using annuity model',
   'These are indicative projections. Actual results may vary based on market conditions.'].forEach((l, i) => {
    p.text(l, M + 4, y + 4 + i * 4);
  });
  ftr(p);
}

// ─── Page 5: Goals ───
function p5(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 5, dt); wm(p);
  let y = secTitle(p, CSY, 'Goal Funding Analysis');
  const goals = r.goalGaps;

  if (!goals || goals.length === 0) {
    p.setTextColor(...S600); p.setFontSize(10); p.setFont('helvetica', 'normal');
    p.text('No financial goals were specified during the assessment.', M + 5, y + 10);
    p.text('Setting clear financial goals is the first step to building wealth.', M + 5, y + 18);
    ftr(p); return;
  }

  p.setFillColor(...TEAL); p.rect(M, y, CW, 7, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(6); p.setFont('helvetica', 'bold');
  p.text('Goal', M + 3, y + 5); p.text('Future Cost', M + 58, y + 5);
  p.text('Progress', M + 90, y + 5); p.text('Monthly SIP', M + 118, y + 5);
  p.text('Status', PW - M - 4, y + 5, { align: 'right' }); y += 7;

  const fc: Record<string, RGB> = { 'on-track': GREEN, 'possible': TEAL, 'stretch': AMBER, 'unrealistic': RED };

  for (let i = 0; i < goals.length; i++) {
    const gl = goals[i];
    p.setFillColor(...(i % 2 === 0 ? S50 : WHITE)); p.rect(M, y, CW, 8, 'F');
    p.setTextColor(...S800); p.setFontSize(6.5); p.setFont('helvetica', 'bold');
    p.text(gl.goalName.substring(0, 22), M + 3, y + 5.5);
    p.setFont('helvetica', 'normal'); p.setTextColor(...S600);
    p.text(formatINR(gl.futureCost), M + 58, y + 5.5);
    p.text(formatINR(gl.currentProgress), M + 90, y + 5.5);
    p.text(gl.monthlyRequired > 0 ? formatINR(gl.monthlyRequired) : '-', M + 118, y + 5.5);

    const fCol = fc[gl.feasibility] || S600;
    const fLbl = gl.feasibility.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    p.setFillColor(...fCol); p.roundedRect(PW - M - 22, y + 1.5, 20, 5, 1, 1, 'F');
    p.setTextColor(255, 255, 255); p.setFontSize(5); p.setFont('helvetica', 'bold');
    p.text(fLbl, PW - M - 12, y + 5, { align: 'center' });
    y += 8;
  }

  y += 8;
  const tfc = goals.reduce((s, g) => s + g.futureCost, 0);
  const tm = goals.reduce((s, g) => s + g.monthlyRequired, 0);
  p.setFillColor(...B50); p.roundedRect(M, y, CW, 14, 2, 2, 'F');
  p.setTextColor(...BLUE); p.setFontSize(8); p.setFont('helvetica', 'bold');
  p.text(`Total Goals: ${goals.length}`, M + 5, y + 6);
  p.text(`Combined Future Cost: ${formatINR(tfc)}`, M + 5, y + 11);
  p.text(`Total Monthly SIP: ${formatINR(tm)}`, PW - M - 5, y + 9, { align: 'right' });
  ftr(p);
}

// ─── Page 6: Insurance ───
function p6(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 6, dt); wm(p);
  let y = secTitle(p, CSY, 'Insurance & Protection Analysis');
  const ins = r.insuranceGap;

  p.setTextColor(...PURPLE); p.setFontSize(10); p.setFont('helvetica', 'bold');
  p.text('Life Insurance Coverage', M + 4, y + 5); y += 10;
  y = kvRow(p, y, 'Human Life Value (HLV)', formatINR(ins.lifeInsuranceNeed));
  y = kvRow(p, y, 'Current Life Cover', formatINR(ins.currentLifeCover));
  const lgc = ins.lifeInsuranceGap > 0 ? RED : GREEN;
  y = kvRow(p, y, 'Life Insurance Gap', ins.lifeInsuranceGap > 0 ? `${formatINR(ins.lifeInsuranceGap)} shortfall` : 'Adequately covered', lgc, lgc);
  y += 3;
  const lmx = Math.max(ins.lifeInsuranceNeed, ins.currentLifeCover, 1);
  p.setTextColor(...S600); p.setFontSize(6.5);
  p.text('Needed', M + 4, y + 3); progBar(p, M + 25, y, CW - 29, 4, ins.lifeInsuranceNeed, lmx, S400); y += 8;
  p.text('Current', M + 4, y + 3); progBar(p, M + 25, y, CW - 29, 4, ins.currentLifeCover, lmx, ins.lifeInsuranceGap > 0 ? ORANGE : GREEN); y += 15;

  p.setTextColor(...BLUE); p.setFontSize(10); p.setFont('helvetica', 'bold');
  p.text('Health Insurance Coverage', M + 4, y + 5); y += 10;
  y = kvRow(p, y, 'Recommended Cover (City-tier)', formatINR(ins.healthInsuranceNeed));
  y = kvRow(p, y, 'Current Health Cover', formatINR(ins.currentHealthCover));
  const hgc = ins.healthInsuranceGap > 0 ? RED : GREEN;
  y = kvRow(p, y, 'Health Insurance Gap', ins.healthInsuranceGap > 0 ? `${formatINR(ins.healthInsuranceGap)} shortfall` : 'Adequately covered', hgc, hgc);
  y += 3;

  const adC: Record<string, RGB> = { 'adequate': GREEN, 'low': AMBER, 'critical': RED };
  const adB: Record<string, RGB> = { 'adequate': E50, 'low': A50, 'critical': R50 };
  p.setFillColor(...(adB[ins.healthAdequacy] || A50)); p.roundedRect(M, y, CW, 10, 2, 2, 'F');
  p.setTextColor(...(adC[ins.healthAdequacy] || AMBER)); p.setFontSize(8); p.setFont('helvetica', 'bold');
  p.text(`Health Cover Adequacy: ${ins.healthAdequacy.toUpperCase()}`, M + 5, y + 7); y += 18;

  p.setFillColor(...S50); p.roundedRect(M, y, CW, 14, 2, 2, 'F');
  p.setTextColor(...S600); p.setFontSize(6.5); p.setFont('helvetica', 'normal');
  const note = p.splitTextToSize('Insurance gap analysis is indicative. For personalized insurance recommendations, please consult a licensed insurance advisor. Trustner Insurance Brokers (IRDAI License #1067) can help you find the right policy.', CW - 10);
  p.text(note, M + 5, y + 5);
  ftr(p);
}

// ─── Page 7: Asset Allocation ───
function p7(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 7, dt); wm(p);
  let y = secTitle(p, CSY, 'Asset Allocation Analysis');
  const cur = r.assetAllocation.current, rec = r.assetAllocation.recommended;
  const ac: Record<string, RGB> = { Equity: BLUE, Debt: TEAL, Gold: AMBER, 'Real Estate': ORANGE, Cash: S400 };
  const cats: [string, number, number][] = [
    ['Equity', cur.equity, rec.equity], ['Debt', cur.debt, rec.debt],
    ['Gold', cur.gold, rec.gold], ['Real Estate', cur.realEstate, rec.realEstate],
    ['Cash', cur.cash, rec.cash],
  ];

  const drawBar = (label: string, data: [string, number][]) => {
    p.setTextColor(...S800); p.setFontSize(10); p.setFont('helvetica', 'bold'); p.text(label, M + 4, y + 5); y += 10;
    let bx = M;
    for (const [n, pct] of data) {
      if (pct <= 0) continue;
      const w = (pct / 100) * CW;
      p.setFillColor(...(ac[n] || S400)); p.rect(bx, y, w, 12, 'F');
      if (w > 15) { p.setTextColor(255, 255, 255); p.setFontSize(6); p.setFont('helvetica', 'bold'); p.text(`${pct.toFixed(0)}%`, bx + w / 2, y + 8, { align: 'center' }); }
      bx += w;
    }
    y += 14;
  };

  drawBar('Current Allocation', cats.map(([n, c]) => [n, c]));
  let lx = M;
  for (const [n] of cats) {
    p.setFillColor(...(ac[n] || S400)); p.rect(lx, y, 4, 4, 'F');
    p.setTextColor(...S600); p.setFontSize(6.5); p.setFont('helvetica', 'normal'); p.text(n, lx + 6, y + 3.5);
    lx += 35;
  }
  y += 12;
  drawBar('Recommended Allocation', cats.map(([n, , r]) => [n, r]));
  y += 4;

  p.setFillColor(...TEAL); p.rect(M, y, CW, 6, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(6.5); p.setFont('helvetica', 'bold');
  p.text('Asset Class', M + 4, y + 4); p.text('Current', M + 80, y + 4); p.text('Recommended', M + 110, y + 4);
  p.text('Action', PW - M - 4, y + 4, { align: 'right' }); y += 6;

  for (let i = 0; i < cats.length; i++) {
    const [n, c, rc] = cats[i];
    p.setFillColor(...(i % 2 === 0 ? S50 : WHITE)); p.rect(M, y, CW, 6, 'F');
    p.setTextColor(...S800); p.setFontSize(6.5); p.setFont('helvetica', 'normal');
    p.text(n, M + 4, y + 4); p.text(`${c.toFixed(0)}%`, M + 80, y + 4); p.text(`${rc.toFixed(0)}%`, M + 110, y + 4);
    const d = rc - c;
    const aCol = d > 5 ? GREEN : d < -5 ? RED : S400;
    const aTxt = d > 5 ? `Increase ${d.toFixed(0)}%` : d < -5 ? `Reduce ${Math.abs(d).toFixed(0)}%` : 'Maintain';
    p.setTextColor(...aCol); p.setFont('helvetica', 'bold'); p.text(aTxt, PW - M - 4, y + 4, { align: 'right' });
    y += 6;
  }
  ftr(p);
}

// ─── Page 8: Action Plan ───
function p8(p: jsPDF, r: FinancialHealthReport, dt: string) {
  p.addPage(); hdr(p, 8, dt); wm(p);
  let y = secTitle(p, CSY, 'Your Action Plan');
  const acts = r.actionPlan;

  if (acts.length === 0) {
    p.setTextColor(...S600); p.setFontSize(10); p.text('No specific action items generated.', M + 5, y + 10);
    ftr(p); return;
  }

  p.setTextColor(...S600); p.setFontSize(8); p.setFont('helvetica', 'normal');
  p.text('Prioritized recommendations based on your financial health assessment:', M + 4, y + 3); y += 10;

  const ic: Record<string, RGB> = { high: RED, medium: AMBER, low: BLUE };
  const ib: Record<string, RGB> = { high: R50, medium: A50, low: B50 };

  for (let i = 0; i < acts.length; i++) {
    const a = acts[i];
    const bg = ib[a.impact] || S50, col = ic[a.impact] || S600;
    p.setFillColor(...bg); p.roundedRect(M, y, CW, 22, 2, 2, 'F');
    p.setFillColor(...col); p.rect(M, y, 3, 22, 'F');
    p.setFillColor(...col); p.circle(M + 10, y + 7, 4, 'F');
    p.setTextColor(255, 255, 255); p.setFontSize(8); p.setFont('helvetica', 'bold');
    p.text(`${i + 1}`, M + 10, y + 9, { align: 'center' });

    p.setFillColor(...col); p.roundedRect(PW - M - 22, y + 3, 18, 6, 1.5, 1.5, 'F');
    p.setTextColor(255, 255, 255); p.setFontSize(5.5); p.text(a.impact.toUpperCase(), PW - M - 13, y + 7.5, { align: 'center' });

    p.setTextColor(...S800); p.setFontSize(8); p.setFont('helvetica', 'bold');
    const al = p.splitTextToSize(a.action, CW - 45); p.text(al.slice(0, 2), M + 18, y + 8);
    p.setTextColor(...S400); p.setFontSize(6); p.setFont('helvetica', 'normal'); p.text(a.category, M + 18, y + 18);
    y += 26;
  }
  ftr(p);
}

// ─── Page 9: AI Narrative ───
function p9(p: jsPDF, r: FinancialHealthReport, nm: string, dt: string) {
  p.addPage(); hdr(p, 9, dt); wm(p);
  let y = secTitle(p, CSY, 'Personalized Assessment');
  const fn = nm.split(' ')[0];
  p.setTextColor(...TEAL); p.setFontSize(11); p.setFont('helvetica', 'bold');
  p.text(`Dear ${fn},`, M + 8, y + 5); y += 12;

  p.setFillColor(...TEAL_LIGHT); p.roundedRect(M, y, CW, 140, 3, 3, 'F');
  p.setDrawColor(...TEAL); p.setLineWidth(0.5); p.roundedRect(M, y, CW, 140, 3, 3, 'S');
  p.setFillColor(...TEAL); p.rect(M, y, 3, 140, 'F');

  p.setTextColor(...S800); p.setFontSize(8); p.setFont('helvetica', 'normal');
  const nar = r.claudeNarrative || 'Your personalized narrative will be generated soon.';
  const nl = p.splitTextToSize(nar, CW - 20); p.text(nl, M + 10, y + 8);
  y += 148;

  p.setTextColor(...S400); p.setFontSize(5.5); p.setFont('helvetica', 'normal');
  p.text("This narrative was generated using AI by Trustner's financial wellness engine.", M + 5, y); y += 8;

  p.setFillColor(...TEAL); p.roundedRect(M, y, CW, 20, 3, 3, 'F');
  p.setTextColor(255, 255, 255); p.setFontSize(10); p.setFont('helvetica', 'bold');
  p.text('Ready to take the next step?', PW / 2, y + 8, { align: 'center' });
  p.setFontSize(8); p.setFont('helvetica', 'normal');
  p.text(`Call ${COMPANY.contact.phoneDisplay} | Visit merasip.com | Email ${COMPANY.contact.email}`, PW / 2, y + 15, { align: 'center' });
  ftr(p);
}

// ─── Page 10: Disclaimers ───
function p10(p: jsPDF, dt: string) {
  p.addPage(); hdr(p, 10, dt); wm(p);
  let y = secTitle(p, CSY, 'Important Disclaimers & Regulatory Information');

  const secs: [string, string][] = [
    ['FINANCIAL WELLNESS ASSESSMENT DISCLAIMER', 'This Financial Health Report is for educational and informational purposes only. It does not constitute investment advice, tax advice, or financial planning advice under SEBI regulations. The assessment scores, projections, and recommendations are based on self-reported data and standard financial planning assumptions. Actual results may vary significantly.'],
    ['MUTUAL FUND DISCLAIMER', DISCLAIMER.mutual_fund + ' ' + DISCLAIMER.risk_factors],
    ['NO GUARANTEE', DISCLAIMER.no_guarantee],
    ['INSURANCE DISCLAIMER', 'Insurance gap analysis provided in this report is indicative and based on general guidelines. For personalized insurance recommendations, please consult a licensed insurance advisor. Trustner Insurance Brokers Pvt. Ltd. (IRDAI License #1067) provides insurance broking services.'],
    ['KYC COMPLIANCE', DISCLAIMER.kyc],
    ['INVESTOR AWARENESS', DISCLAIMER.sebi_investor + ' ' + DISCLAIMER.grievance],
  ];

  for (const [h, t] of secs) {
    if (y > PH - FH - 25) break;
    p.setTextColor(...S800); p.setFontSize(7); p.setFont('helvetica', 'bold'); p.text(h, M + 2, y); y += 3.5;
    p.setTextColor(...S600); p.setFontSize(6); p.setFont('helvetica', 'normal');
    const ls = p.splitTextToSize(t, CW - 6); p.text(ls, M + 3, y); y += ls.length * 2.8 + 4;
  }

  y += 2; p.setDrawColor(...S200); p.setLineWidth(0.2); p.line(M, y, PW - M, y); y += 4;
  p.setTextColor(...S800); p.setFontSize(7); p.setFont('helvetica', 'bold'); p.text('ABOUT THE DISTRIBUTOR', M + 2, y); y += 5;

  const dets: [string, string][] = [
    ['Firm Name', COMPANY.mfEntity.name], ['Type', COMPANY.mfEntity.type],
    ['AMFI ARN', COMPANY.mfEntity.amfiArn], ['CIN', COMPANY.mfEntity.cin],
    ['Offices', COMPANY.offices.map(o => o.city).join(' | ')],
    ['Contact', `${COMPANY.contact.phoneDisplay} | ${COMPANY.contact.email}`],
    ['Website', 'www.merasip.com | www.trustner.in'],
    ['Grievance', COMPANY.contact.grievanceEmail],
  ];
  for (const [l, v] of dets) {
    p.setTextColor(...S400); p.setFontSize(5.5); p.setFont('helvetica', 'normal'); p.text(`${l}:`, M + 3, y);
    p.setTextColor(...S600); p.setFont('helvetica', 'bold'); p.text(v, M + 28, y); y += 3.5;
  }

  y += 4;
  if (y < PH - FH - 15) {
    p.setFillColor(...B50); p.roundedRect(M, y, CW, 10, 2, 2, 'F');
    p.setTextColor(...BLUE); p.setFontSize(5.5); p.setFont('helvetica', 'bold');
    p.text('SEBI INVESTOR CHARTER', M + 4, y + 4);
    p.setFont('helvetica', 'normal');
    p.text('For more details: www.sebi.gov.in | SCORES: scores.gov.in | Toll Free: 1800-22-7575', M + 4, y + 7.5);
  }
  ftr(p);
}

// ─── Main Export ───
export function generateFinancialReport(
  report: FinancialHealthReport,
  data: FinancialPlanningData,
  userName: string
): Buffer {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  p1(pdf, report, userName, date);
  p2(pdf, report, date);
  p3(pdf, report, data, date);
  p4(pdf, report, date);
  p5(pdf, report, date);
  p6(pdf, report, date);
  p7(pdf, report, date);
  p8(pdf, report, date);
  p9(pdf, report, userName, date);
  p10(pdf, date);

  return Buffer.from(pdf.output('arraybuffer'));
}
