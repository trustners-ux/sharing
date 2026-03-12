import React, { useState, useEffect } from 'react';
import {
  Users,
  Grid3X3,
  Calculator,
  Award,
  ArrowUpCircle,
  ArrowDownCircle,
  Shield,
  ChevronDown,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Plus,
  RefreshCw,
  Edit2,
  Save,
  FileText,
  TrendingUp,
} from 'lucide-react';
import * as pospCategoryAPI from '../../services/pospCategory';
import { formatCurrency, formatDate } from '../../utils/formatters';

// ── Category definitions ─────────────────────────────────────────────
const CATEGORIES = [
  { value: 'A', label: 'Standard Entry' },
  { value: 'B', label: 'Standard Growth' },
  { value: 'C', label: 'Established' },
  { value: 'D', label: 'High Performing' },
  { value: 'D_PLUS', label: 'Enhanced' },
  { value: 'E', label: 'Premium' },
  { value: 'E_PLUS', label: 'High Volume' },
  { value: 'F1', label: 'Top Tier' },
  { value: 'F2', label: 'Motor Focus' },
  { value: 'F3', label: 'Strategic Partner' },
];

const CATEGORY_COLORS = {
  A: 'bg-gray-100 text-gray-700 border-gray-300',
  B: 'bg-blue-100 text-blue-700 border-blue-300',
  C: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  D: 'bg-violet-100 text-violet-700 border-violet-300',
  D_PLUS: 'bg-purple-100 text-purple-700 border-purple-300',
  E: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
  E_PLUS: 'bg-pink-100 text-pink-700 border-pink-300',
  F1: 'bg-orange-100 text-orange-700 border-orange-300',
  F2: 'bg-amber-100 text-amber-700 border-amber-300',
  F3: 'bg-emerald-100 text-emerald-700 border-emerald-300',
};

const CATEGORY_DOT = {
  A: 'bg-gray-500',
  B: 'bg-blue-500',
  C: 'bg-indigo-500',
  D: 'bg-violet-500',
  D_PLUS: 'bg-purple-500',
  E: 'bg-fuchsia-500',
  E_PLUS: 'bg-pink-500',
  F1: 'bg-orange-500',
  F2: 'bg-amber-500',
  F3: 'bg-emerald-500',
};

const LOB_OPTIONS = [
  { value: '', label: 'All LOBs' },
  { value: 'GI', label: 'General Insurance' },
  { value: 'LI', label: 'Life Insurance' },
  { value: 'HI', label: 'Health Insurance' },
];

const TIER_LABELS = {
  HIGH: { label: 'HIGH', desc: '\u226530%', color: 'bg-green-100 text-green-700' },
  MEDIUM: { label: 'MEDIUM', desc: '15-29%', color: 'bg-yellow-100 text-yellow-700' },
  LOW: { label: 'LOW', desc: '<15%', color: 'bg-red-100 text-red-700' },
};

const displayCategory = (val) => {
  if (val === 'D_PLUS') return 'D+';
  if (val === 'E_PLUS') return 'E+';
  return val;
};

const getCategoryLabel = (val) => {
  const found = CATEGORIES.find((c) => c.value === val);
  return found ? found.label : val;
};

// ── Main Component ───────────────────────────────────────────────────
const POSPCategoryPage = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Tab 1: Category Assignments state ---
  const [dashboard, setDashboard] = useState({
    totalAssignments: 0,
    byCategory: {},
    activePosps: 0,
    payoutRecords: 0,
  });
  const [assignments, setAssignments] = useState([]);
  const [assignmentTotal, setAssignmentTotal] = useState(0);
  const [assignPage, setAssignPage] = useState(1);
  const [lobFilter, setLobFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    pospId: '',
    lob: 'GI',
    category: 'A',
    reason: '',
  });
  const [saving, setSaving] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // --- Tab 2: Tier Sharing Matrix state ---
  const [tierMatrix, setTierMatrix] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [matrixLoading, setMatrixLoading] = useState(false);
  const [seedingMatrix, setSeedingMatrix] = useState(false);

  // --- Tab 3: Quick Calculator state ---
  const [calcForm, setCalcForm] = useState({
    trustnerCommissionPct: '',
    category: 'A',
    premiumAmount: '',
  });
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // ── Effects ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === 'assignments') {
      fetchDashboard();
      fetchAssignments();
    } else if (activeTab === 'matrix') {
      fetchTierMatrix();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'assignments') {
      fetchAssignments();
    }
  }, [assignPage, lobFilter, catFilter]);

  // ── Notification auto-dismiss ──────────────────────────────────────
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ── Fetch functions ────────────────────────────────────────────────
  const fetchDashboard = async () => {
    try {
      const res = await pospCategoryAPI.getDashboard();
      const data = res.data || res || {};
      setDashboard({
        totalAssignments: data.totalAssignments || 0,
        byCategory: data.byCategory || {},
        activePosps: data.activePosps || 0,
        payoutRecords: data.payoutRecords || 0,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = {
        page: assignPage,
        limit: 20,
        lob: lobFilter || undefined,
        category: catFilter || undefined,
      };
      const res = await pospCategoryAPI.listAssignments(params);
      const data = res.data || res || {};
      setAssignments(data.data || data.assignments || []);
      setAssignmentTotal(data.total || 0);
    } catch (err) {
      console.error('Assignments fetch error:', err);
      setNotification({ type: 'error', msg: 'Failed to load category assignments' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTierMatrix = async () => {
    try {
      setMatrixLoading(true);
      const res = await pospCategoryAPI.getTierSharing();
      const data = res.data || res || [];
      setTierMatrix(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Tier matrix fetch error:', err);
      setNotification({ type: 'error', msg: 'Failed to load tier sharing matrix' });
    } finally {
      setMatrixLoading(false);
    }
  };

  // ── Handlers ───────────────────────────────────────────────────────
  const handleAssignCategory = async () => {
    if (!assignForm.pospId || !assignForm.lob || !assignForm.category) {
      setNotification({ type: 'error', msg: 'Please fill in all required fields' });
      return;
    }
    try {
      setSaving(true);
      await pospCategoryAPI.assignCategory({
        pospId: assignForm.pospId,
        lob: assignForm.lob,
        category: assignForm.category,
        reason: assignForm.reason || undefined,
      });
      setNotification({ type: 'success', msg: 'Category assigned successfully' });
      setShowAssignModal(false);
      setAssignForm({ pospId: '', lob: 'GI', category: 'A', reason: '' });
      fetchAssignments();
      fetchDashboard();
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || 'Failed to assign category',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAssign = async () => {
    try {
      setBulkLoading(true);
      await pospCategoryAPI.bulkAssignDefaults();
      setNotification({ type: 'success', msg: 'Default categories assigned to all POSPs' });
      fetchAssignments();
      fetchDashboard();
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || 'Bulk assignment failed',
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleUpgradeDowngrade = async (assignment, direction) => {
    const categoryOrder = CATEGORIES.map((c) => c.value);
    const currentIdx = categoryOrder.indexOf(assignment.category);
    let newIdx;

    if (direction === 'upgrade') {
      newIdx = Math.min(currentIdx + 1, categoryOrder.length - 1);
    } else {
      newIdx = Math.max(currentIdx - 1, 0);
    }

    if (newIdx === currentIdx) {
      setNotification({
        type: 'error',
        msg: `Already at ${direction === 'upgrade' ? 'highest' : 'lowest'} category`,
      });
      return;
    }

    const newCategory = categoryOrder[newIdx];
    try {
      await pospCategoryAPI.updateCategory(assignment.pospId, assignment.lob, {
        category: newCategory,
        reason: `${direction === 'upgrade' ? 'Upgraded' : 'Downgraded'} from ${displayCategory(assignment.category)} to ${displayCategory(newCategory)}`,
      });
      setNotification({
        type: 'success',
        msg: `POSP ${direction === 'upgrade' ? 'upgraded' : 'downgraded'} to ${displayCategory(newCategory)}`,
      });
      fetchAssignments();
      fetchDashboard();
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || `Failed to ${direction} category`,
      });
    }
  };

  const handleCellEdit = (category, tier, currentValue) => {
    setEditingCell({ category, tier });
    setEditValue(String(currentValue || ''));
  };

  const handleCellSave = async () => {
    if (!editingCell) return;
    const { category, tier } = editingCell;
    const pct = parseFloat(editValue);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setNotification({ type: 'error', msg: 'Please enter a valid percentage (0-100)' });
      return;
    }
    try {
      await pospCategoryAPI.upsertTierSharing({
        category,
        tier,
        sharingPct: pct,
      });
      setNotification({ type: 'success', msg: 'Sharing percentage updated' });
      setEditingCell(null);
      setEditValue('');
      fetchTierMatrix();
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || 'Failed to update sharing',
      });
    }
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const handleSeedMatrix = async () => {
    try {
      setSeedingMatrix(true);
      await pospCategoryAPI.seedTierSharing();
      setNotification({ type: 'success', msg: 'Default tier sharing matrix seeded' });
      fetchTierMatrix();
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || 'Failed to seed tier matrix',
      });
    } finally {
      setSeedingMatrix(false);
    }
  };

  const handleQuickCalc = async () => {
    const commission = parseFloat(calcForm.trustnerCommissionPct);
    const premium = parseFloat(calcForm.premiumAmount);
    if (isNaN(commission) || commission <= 0 || commission > 100) {
      setNotification({ type: 'error', msg: 'Enter a valid Trustner Commission % (0-100)' });
      return;
    }
    if (isNaN(premium) || premium <= 0) {
      setNotification({ type: 'error', msg: 'Enter a valid premium amount' });
      return;
    }
    try {
      setCalculating(true);
      const res = await pospCategoryAPI.quickCalculate({
        trustnerCommissionPct: commission,
        category: calcForm.category,
        premiumAmount: premium,
      });
      setCalcResult(res.data || res || {});
    } catch (err) {
      setNotification({
        type: 'error',
        msg: err?.response?.data?.message || 'Calculation failed',
      });
    } finally {
      setCalculating(false);
    }
  };

  // ── Helper: get tier matrix value ──────────────────────────────────
  const getMatrixValue = (category, tier) => {
    const entry = tierMatrix.find(
      (m) => m.category === category && m.tier === tier
    );
    return entry ? Number(entry.sharingPct) : null;
  };

  // ── Helper: top 3 categories by count ──────────────────────────────
  const topCategories = () => {
    const entries = Object.entries(dashboard.byCategory || {});
    return entries
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))
      .slice(0, 3);
  };

  // ── Helper: filtered assignments ───────────────────────────────────
  const filteredAssignments = (Array.isArray(assignments) ? assignments : []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (a.pospCode || '').toLowerCase().includes(q) ||
      (a.pospName || '').toLowerCase().includes(q) ||
      (a.posp?.agentCode || '').toLowerCase().includes(q) ||
      (a.posp?.firstName || '').toLowerCase().includes(q) ||
      (a.posp?.lastName || '').toLowerCase().includes(q)
    );
  });

  // ── Cell background for tier matrix ────────────────────────────────
  const getCellBg = (pct) => {
    if (pct === null || pct === undefined) return 'bg-gray-50';
    if (pct >= 65) return 'bg-teal-100';
    if (pct >= 55) return 'bg-teal-50';
    if (pct >= 45) return 'bg-emerald-50';
    if (pct >= 35) return 'bg-green-50';
    if (pct >= 25) return 'bg-lime-50';
    return 'bg-yellow-50';
  };

  // ── Total pages ────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(assignmentTotal / 20));

  // ══════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Toast Notification ──────────────────────────────────────── */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{notification.msg}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-teal-600" />
            POSP Category Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the 10-grade POSP category system (A - F3) for commission sharing
          </p>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────────── */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: 'assignments', label: 'Category Assignments', icon: Users },
          { id: 'matrix', label: 'Tier Sharing Matrix', icon: Grid3X3 },
          { id: 'calculator', label: 'Quick Calculator', icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 1: Category Assignments                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'assignments' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Assignments */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard.totalAssignments}</p>
            </div>

            {/* By Category (top 3) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 mb-3">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Top Categories</p>
              <div className="mt-2 space-y-1">
                {topCategories().length > 0 ? (
                  topCategories().map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${CATEGORY_DOT[cat] || 'bg-gray-400'}`} />
                        <span className="font-medium text-gray-700">{displayCategory(cat)}</span>
                      </span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No data</p>
                )}
              </div>
            </div>

            {/* Active POSPs */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Active POSPs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard.activePosps}</p>
            </div>

            {/* Payout Records */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600 mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Payout Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{dashboard.payoutRecords}</p>
            </div>
          </div>

          {/* Action Buttons & Filter Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* Filters */}
              <div className="flex items-center gap-3 flex-1 flex-wrap">
                <select
                  value={lobFilter}
                  onChange={(e) => { setLobFilter(e.target.value); setAssignPage(1); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[140px]"
                >
                  {LOB_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <select
                  value={catFilter}
                  onChange={(e) => { setCatFilter(e.target.value); setAssignPage(1); }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[140px]"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {displayCategory(c.value)} - {c.label}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Search by POSP code or name..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkAssign}
                  disabled={bulkLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                >
                  <RefreshCw className={`w-4 h-4 ${bulkLoading ? 'animate-spin' : ''}`} />
                  Bulk Assign Defaults
                </button>
                <button
                  onClick={() => {
                    setAssignForm({ pospId: '', lob: 'GI', category: 'A', reason: '' });
                    setShowAssignModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Assign Category
                </button>
              </div>
            </div>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading assignments...</p>
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No category assignments found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Use "Assign Category" or "Bulk Assign Defaults" to get started
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          POSP Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          POSP Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          LOB
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Effective From
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Reason
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredAssignments.map((a, idx) => {
                        const pospCode = a.pospCode || a.posp?.agentCode || '-';
                        const pospName =
                          a.pospName ||
                          [a.posp?.firstName, a.posp?.lastName].filter(Boolean).join(' ') ||
                          '-';
                        return (
                          <tr key={a.id || idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-900">{pospCode}</td>
                            <td className="px-4 py-3 text-gray-700">{pospName}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {a.lob || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                  CATEGORY_COLORS[a.category] || 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    CATEGORY_DOT[a.category] || 'bg-gray-400'
                                  }`}
                                />
                                {displayCategory(a.category)}
                                <span className="text-[10px] opacity-70 font-normal ml-0.5">
                                  {getCategoryLabel(a.category)}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {formatDate(a.effectiveFrom || a.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                              {a.reason || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleUpgradeDowngrade(a, 'upgrade')}
                                  title="Upgrade category"
                                  className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                >
                                  <ArrowUpCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpgradeDowngrade(a, 'downgrade')}
                                  title="Downgrade category"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                >
                                  <ArrowDownCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-500">
                      Page {assignPage} of {totalPages} ({assignmentTotal} total)
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAssignPage((p) => Math.max(1, p - 1))}
                        disabled={assignPage <= 1}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setAssignPage((p) => Math.min(totalPages, p + 1))}
                        disabled={assignPage >= totalPages}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 2: Tier Sharing Matrix                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'matrix' && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tier Sharing Matrix</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Commission sharing percentages by POSP category and Trustner commission tier.
                  Click any cell to edit.
                </p>
              </div>
              <button
                onClick={handleSeedMatrix}
                disabled={seedingMatrix}
                className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm font-medium disabled:opacity-50 whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${seedingMatrix ? 'animate-spin' : ''}`} />
                Seed Default Matrix
              </button>
            </div>

            {matrixLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading tier matrix...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-200 rounded-tl-lg min-w-[160px]">
                        Category
                      </th>
                      {Object.entries(TIER_LABELS).map(([tier, info]) => (
                        <th
                          key={tier}
                          className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border border-gray-200 min-w-[140px]"
                        >
                          <div>{info.label}</div>
                          <div className="text-[10px] font-normal text-gray-400 mt-0.5">
                            ({info.desc})
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map((cat) => (
                      <tr key={cat.value}>
                        <td className="px-4 py-3 border border-gray-200 bg-white">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                CATEGORY_COLORS[cat.value]
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[cat.value]}`}
                              />
                              {displayCategory(cat.value)}
                            </span>
                            <span className="text-xs text-gray-500">{cat.label}</span>
                          </div>
                        </td>
                        {['HIGH', 'MEDIUM', 'LOW'].map((tier) => {
                          const val = getMatrixValue(cat.value, tier);
                          const isEditing =
                            editingCell?.category === cat.value && editingCell?.tier === tier;
                          return (
                            <td
                              key={tier}
                              className={`px-4 py-3 border border-gray-200 text-center transition-colors ${
                                isEditing ? 'bg-teal-50' : getCellBg(val)
                              }`}
                            >
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-1">
                                  <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleCellSave();
                                      if (e.key === 'Escape') handleCellCancel();
                                    }}
                                    className="w-16 px-2 py-1 border border-teal-400 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    autoFocus
                                  />
                                  <button
                                    onClick={handleCellSave}
                                    className="p-1 rounded hover:bg-green-100 text-green-600"
                                    title="Save"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={handleCellCancel}
                                    className="p-1 rounded hover:bg-red-100 text-red-600"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleCellEdit(cat.value, tier, val)}
                                  className="group w-full flex items-center justify-center gap-1 hover:text-teal-700 transition-colors"
                                  title="Click to edit"
                                >
                                  <span className="text-sm font-semibold text-gray-800">
                                    {val !== null ? `${val}%` : '--'}
                                  </span>
                                  <Edit2 className="w-3 h-3 text-gray-300 group-hover:text-teal-500 transition-colors" />
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span className="font-medium">Tier Thresholds:</span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-100 border border-green-300" />
                HIGH (&ge;30% Trustner commission)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
                MEDIUM (15-29%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-100 border border-red-300" />
                LOW (&lt;15%)
              </span>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* TAB 3: Quick Calculator                                       */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Input Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Payout Calculator</h2>
                <p className="text-sm text-gray-500">
                  Estimate agent payout based on category and commission
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Trustner Commission % */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Trustner Commission %
                </label>
                <input
                  type="number"
                  value={calcForm.trustnerCommissionPct}
                  onChange={(e) =>
                    setCalcForm((prev) => ({ ...prev, trustnerCommissionPct: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., 25"
                  min="0"
                  max="100"
                  step="0.5"
                />
                <p className="text-xs text-gray-400 mt-1">
                  The commission percentage Trustner earns from the insurer
                </p>
              </div>

              {/* POSP Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  POSP Category
                </label>
                <select
                  value={calcForm.category}
                  onChange={(e) =>
                    setCalcForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {displayCategory(c.value)} - {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Premium Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Premium Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-gray-500">&#x20B9;</span>
                  <input
                    type="number"
                    value={calcForm.premiumAmount}
                    onChange={(e) =>
                      setCalcForm((prev) => ({ ...prev, premiumAmount: e.target.value }))
                    }
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="e.g., 50000"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleQuickCalc}
                disabled={calculating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {calculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4" /> Calculate Payout
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Payout Breakdown</h2>
                <p className="text-sm text-gray-500">Detailed commission sharing breakdown</p>
              </div>
            </div>

            {calcResult ? (
              <div className="space-y-4">
                {/* Tier Badge */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Commission Tier:</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      TIER_LABELS[calcResult.tier]?.color || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {calcResult.tier || 'N/A'}
                  </span>
                </div>

                {/* Breakdown Items */}
                <div className="divide-y divide-gray-100">
                  {[
                    {
                      label: 'Sharing %',
                      value: `${calcResult.sharingPct ?? calcResult.sharing ?? '--'}%`,
                      sub: 'From tier sharing matrix',
                    },
                    {
                      label: 'Agent Payout %',
                      value: `${calcResult.agentPayoutPct ?? '--'}%`,
                      sub: 'Commission x Sharing / 100',
                    },
                    {
                      label: 'Agent Payout Amount',
                      value: formatCurrency(calcResult.agentPayoutAmount ?? calcResult.agentPayout),
                      sub: 'Gross payout to agent',
                      highlight: true,
                    },
                    {
                      label: 'Trustner Retains',
                      value: formatCurrency(calcResult.trustnerRetains ?? calcResult.trustnerAmount),
                      sub: 'Commission retained by Trustner',
                    },
                    {
                      label: 'TDS (5%)',
                      value: formatCurrency(calcResult.tds ?? calcResult.tdsAmount),
                      sub: 'Tax deducted at source',
                      negative: true,
                    },
                    {
                      label: 'Net Payout',
                      value: formatCurrency(calcResult.netPayout ?? calcResult.netAmount),
                      sub: 'Final amount payable to agent',
                      highlight: true,
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3">
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            item.highlight ? 'text-teal-700' : item.negative ? 'text-red-600' : 'text-gray-700'
                          }`}
                        >
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                      <p
                        className={`text-lg font-bold ${
                          item.highlight ? 'text-teal-700' : item.negative ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Category Info */}
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-800 font-medium">
                      Category {displayCategory(calcResult.category || calcForm.category)}
                    </span>
                    <span className="text-teal-600">
                      ({getCategoryLabel(calcResult.category || calcForm.category)})
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm text-gray-500">Enter values and click Calculate</p>
                <p className="text-xs text-gray-400 mt-1">
                  The breakdown will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MODAL: Assign Category                                        */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">Assign Category</h3>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* POSP ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  POSP ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={assignForm.pospId}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, pospId: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter POSP ID"
                />
              </div>

              {/* LOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Line of Business <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignForm.lob}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, lob: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="GI">General Insurance</option>
                  <option value="LI">Life Insurance</option>
                  <option value="HI">Health Insurance</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={assignForm.category}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {displayCategory(c.value)} - {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason
                </label>
                <textarea
                  value={assignForm.reason}
                  onChange={(e) =>
                    setAssignForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="Optional: Reason for category assignment..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCategory}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Assign Category
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPCategoryPage;
