'use client';

import React, { useState, useCallback } from 'react';
import {
  FileText,
  Download,
  Sparkles,
  User,
  Hash,
  ChevronRight,
  Shield,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import {
  type Category,
  type LOB,
  CATEGORIES,
  LOB_CONFIG,
  calculateAgentPayout,
} from '@/data/posp-payout-data';

// --- Category Labels for Dropdown ---
const CATEGORY_LABELS: Record<Category, string> = {
  'A': 'A - Standard Entry',
  'B': 'B - Standard Growth',
  'C': 'C - Established',
  'D': 'D - High Performing',
  'D+': 'D+ - Enhanced',
  'E': 'E - Premium',
  'E+': 'E+ - High Volume',
  'F1': 'F1 - Top Tier',
  'F2': 'F2 - Motor Focus',
  'F3': 'F3 - Strategic Partner',
};

// --- LOB Display Config ---
const LOB_DISPLAY: Record<LOB, { icon: string; bgColor: string; textColor: string; borderColor: string; lightBg: string }> = {
  GI: { icon: '🚗', bgColor: 'bg-blue-600', textColor: 'text-blue-700', borderColor: 'border-blue-200', lightBg: 'bg-blue-50' },
  LI: { icon: '🛡️', bgColor: 'bg-purple-600', textColor: 'text-purple-700', borderColor: 'border-purple-200', lightBg: 'bg-purple-50' },
  HI: { icon: '🏥', bgColor: 'bg-teal-600', textColor: 'text-teal-700', borderColor: 'border-teal-200', lightBg: 'bg-teal-50' },
};

export default function PayoutGenerator() {
  // Form state
  const [pospName, setPospName] = useState('');
  const [pospCode, setPospCode] = useState('');
  const [giCategory, setGiCategory] = useState<Category | ''>('');
  const [liCategory, setLiCategory] = useState<Category | ''>('');
  const [hiCategory, setHiCategory] = useState<Category | ''>('');

  // UI state
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [expandedLob, setExpandedLob] = useState<LOB | null>('GI');

  const isFormValid = pospName.trim() && pospCode.trim() && giCategory && liCategory && hiCategory;

  const handleGenerate = () => {
    if (!isFormValid) return;
    setIsGenerated(true);
    setExpandedLob('GI');
    // Scroll to preview
    setTimeout(() => {
      document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setIsGenerated(false);
    setPospName('');
    setPospCode('');
    setGiCategory('');
    setLiCategory('');
    setHiCategory('');
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!giCategory || !liCategory || !hiCategory) return;
    setIsGeneratingPDF(true);

    try {
      // Dynamic import to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { default: PayoutPDFDocument } = await import('./PayoutPDFDocument');

      const generatedDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const blob = await pdf(
        <PayoutPDFDocument
          pospName={pospName}
          pospCode={pospCode}
          giCategory={giCategory as Category}
          liCategory={liCategory as Category}
          hiCategory={hiCategory as Category}
          generatedDate={generatedDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeCode = pospCode.replace(/\//g, '-');
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `Trustner_Payout_Schedule_${safeCode}_${dateStr}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [pospName, pospCode, giCategory, liCategory, hiCategory]);

  const getCategoryForLob = (lob: LOB): Category | '' => {
    switch (lob) {
      case 'GI': return giCategory;
      case 'LI': return liCategory;
      case 'HI': return hiCategory;
    }
  };

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A1628] via-[#1a2d4a] to-[#0A1628] text-white">
        <div className="container-custom py-8 lg:py-12">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2 text-sm text-blue-200/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">POSP Payouts</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <FileText className="h-7 w-7 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                POSP Payout Schedule Generator
              </h1>
              <p className="mt-1.5 text-blue-200/80 max-w-2xl text-sm lg:text-base">
                Generate personalized commission payout schedules across General Insurance,
                Life Insurance & Health Insurance. Download a professional PDF to share.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-blue-200">
                <Shield size={12} />
                Trustner Insurance Brokers Pvt. Ltd. | IRDAI License No. 1067
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Input Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* POSP Details Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
              <User size={18} className="text-primary-500" />
              POSP Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  POSP Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={pospName}
                  onChange={(e) => setPospName(e.target.value)}
                  placeholder="e.g., Rahul Sharma"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  POSP Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={pospCode}
                    onChange={(e) => setPospCode(e.target.value)}
                    placeholder="e.g., TIB/POSP/074/2526"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-primary-400 focus:bg-white focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Selection Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-5">
              <Sparkles size={18} className="text-accent-500" />
              Category Selection (Per LOB)
            </h3>
            <div className="space-y-4">
              {/* GI Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
                    General Insurance (GI) <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={giCategory}
                    onChange={(e) => setGiCategory(e.target.value as Category)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select GI Category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* LI Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" />
                    Life Insurance (LI) <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={liCategory}
                    onChange={(e) => setLiCategory(e.target.value as Category)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">Select LI Category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* HI Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-500" />
                    Health Insurance (HI) <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <select
                    value={hiCategory}
                    onChange={(e) => setHiCategory(e.target.value as Category)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">Select HI Category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={handleGenerate}
            disabled={!isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
              isFormValid
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600 hover:shadow-xl active:scale-[0.98]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles size={18} />
            Generate Payout Schedule
          </button>
          {isGenerated && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Preview Section */}
        {isGenerated && giCategory && liCategory && hiCategory && (
          <div id="preview-section" className="space-y-6">
            {/* Summary Bar */}
            <div className="rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 p-5 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-white/80">Payout Schedule For</p>
                  <h2 className="text-xl font-bold">{pospName}</h2>
                  <p className="text-sm text-white/70 mt-0.5">{pospCode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold">
                    GI: {giCategory}
                  </div>
                  <div className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold">
                    LI: {liCategory}
                  </div>
                  <div className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-semibold">
                    HI: {hiCategory}
                  </div>
                </div>
              </div>
            </div>

            {/* LOB Tables */}
            {(['GI', 'LI', 'HI'] as LOB[]).map((lob) => {
              const category = getCategoryForLob(lob) as Category;
              const config = LOB_CONFIG[lob];
              const display = LOB_DISPLAY[lob];
              const isExpanded = expandedLob === lob;

              return (
                <div key={lob} className="rounded-2xl border border-gray-100 bg-white shadow-card overflow-hidden">
                  {/* LOB Header (Clickable) */}
                  <button
                    onClick={() => setExpandedLob(isExpanded ? null : lob)}
                    className={`w-full flex items-center justify-between p-5 transition-colors hover:bg-gray-50 ${
                      isExpanded ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${display.lightBg} text-lg`}>
                        {display.icon}
                      </span>
                      <div className="text-left">
                        <h3 className={`font-bold ${display.textColor}`}>{config.fullName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Category {category} &middot; {config.data.length} Products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`hidden sm:inline-flex items-center gap-1 rounded-full ${display.lightBg} ${display.textColor} px-3 py-1 text-xs font-semibold`}>
                        {config.data.length} products
                      </span>
                      <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Table Content */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 w-12">#</th>
                            <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Product</th>
                            <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Insurer</th>
                            <th className="py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">Your Payout</th>
                            <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">Calculated On</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let serial = 0;
                            let currentLine = '';
                            const rows: React.ReactNode[] = [];

                            config.data.forEach((entry, idx) => {
                              const result = calculateAgentPayout(entry.trustnerCommission, category);
                              const isNewGroup = entry.productLine !== currentLine;
                              if (isNewGroup) {
                                currentLine = entry.productLine;
                                rows.push(
                                  <tr key={`group-${idx}`}>
                                    <td colSpan={5} className={`py-2 px-4 text-xs font-bold ${display.textColor} ${display.lightBg} border-b ${display.borderColor}`}>
                                      {entry.productLine.toUpperCase()}
                                    </td>
                                  </tr>
                                );
                              }
                              serial++;
                              rows.push(
                                <tr key={`row-${idx}`} className={serial % 2 === 0 ? 'bg-gray-50/50' : ''}>
                                  <td className="py-2.5 px-4 text-xs text-gray-400 border-b border-gray-50">{serial}</td>
                                  <td className="py-2.5 px-4 text-sm text-gray-900 font-medium border-b border-gray-50">{entry.product}</td>
                                  <td className="py-2.5 px-4 text-xs text-gray-500 border-b border-gray-50">{entry.insurer}</td>
                                  <td className="py-2.5 px-4 text-center border-b border-gray-50">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                                      {result.agentPayout.toFixed(2)}%
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 text-xs text-gray-500 border-b border-gray-50">{entry.basis}</td>
                                </tr>
                              );
                            });

                            return rows;
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Download PDF Button */}
            <div className="sticky bottom-4 z-10">
              <button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 text-base font-bold text-white shadow-xl shadow-green-600/30 transition-all hover:bg-green-700 hover:shadow-2xl active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating PDF... Please wait
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Download PDF Payout Schedule
                  </>
                )}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
              <p className="text-xs leading-relaxed text-amber-800">
                <strong>Disclaimer:</strong> This payout schedule is issued by Trustner Insurance Brokers
                Private Limited (IRDAI License No. 1067). Commission rates are indicative and subject to
                revision based on insurer grid changes. Payouts are processed after premium realization
                and reconciliation. Insurance is the subject matter of solicitation. IRDAI does not involve
                in or endorse any insurance payout. For queries: operations@trustner.in
              </p>
            </div>
          </div>
        )}

        {/* Empty State (before generation) */}
        {!isGenerated && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-16 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-400">No Schedule Generated Yet</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
              Fill in the POSP details and select categories for each Line of Business, then click
              &ldquo;Generate Payout Schedule&rdquo; to preview and download the PDF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
