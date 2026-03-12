import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Filter,
  Calculator,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  X,
  Database,
  TrendingUp,
  Shield,
  Heart,
  BarChart3,
} from 'lucide-react';
import * as pospCategoryAPI from '../../services/pospCategory';
import { formatCurrency } from '../../utils/formatters';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const CATEGORIES = [
  { value: 'A', label: 'A - Standard Entry' },
  { value: 'B', label: 'B - Standard Growth' },
  { value: 'C', label: 'C - Established' },
  { value: 'D', label: 'D - High Performing' },
  { value: 'D_PLUS', label: 'D+ - Enhanced' },
  { value: 'E', label: 'E - Premium' },
  { value: 'E_PLUS', label: 'E+ - High Volume' },
  { value: 'F1', label: 'F1 - Top Tier' },
  { value: 'F2', label: 'F2 - Motor Focus' },
  { value: 'F3', label: 'F3 - Strategic Partner' },
];

const LOB_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'GI', label: 'GI' },
  { key: 'LI', label: 'LI' },
  { key: 'HI', label: 'HI' },
];

const LOB_COLORS = {
  GI: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-600', light: 'bg-blue-50' },
  LI: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-600', light: 'bg-purple-50' },
  HI: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', accent: 'bg-teal-600', light: 'bg-teal-50' },
};

const LOB_ICONS = {
  GI: Shield,
  LI: TrendingUp,
  HI: Heart,
};

const ITEMS_PER_PAGE = 50;

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const getCommissionTier = (pct) => {
  if (pct == null || isNaN(pct)) return { tier: '-', color: 'bg-gray-100 text-gray-600' };
  if (pct >= 30) return { tier: 'HIGH', color: 'bg-green-100 text-green-700 border border-green-200' };
  if (pct >= 15) return { tier: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border border-amber-200' };
  return { tier: 'LOW', color: 'bg-red-100 text-red-700 border border-red-200' };
};

const getCommissionBadgeColor = (pct) => {
  if (pct == null || isNaN(pct)) return 'bg-gray-100 text-gray-600';
  if (pct >= 30) return 'bg-green-100 text-green-800';
  if (pct >= 15) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const getLobBadge = (lob) => {
  const colors = LOB_COLORS[lob] || { bg: 'bg-gray-100', text: 'text-gray-700' };
  return `${colors.bg} ${colors.text}`;
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

const ProductCatalogPage = () => {
  // Data state
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, gi: 0, li: 0, hi: 0 });
  const [filterOptions, setFilterOptions] = useState({ insurers: [], productLines: [] });
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state
  const [lobFilter, setLobFilter] = useState('ALL');
  const [insurerFilter, setInsurerFilter] = useState('');
  const [productLineFilter, setProductLineFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(null);

  // Calculator state
  const [calcOpenId, setCalcOpenId] = useState(null);
  const [calcCategory, setCalcCategory] = useState('A');
  const [calcPremium, setCalcPremium] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // ─── Data Fetching ────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const res = await pospCategoryAPI.getProductStats();
      const data = res.data || res || {};
      setStats({
        total: data.total || 0,
        gi: data.gi || data.GI || 0,
        li: data.li || data.LI || 0,
        hi: data.hi || data.HI || 0,
      });
    } catch (err) {
      console.error('Failed to load product stats:', err);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await pospCategoryAPI.getFilterOptions();
      const data = res.data || res || {};
      setFilterOptions({
        insurers: data.insurers || [],
        productLines: data.productLines || [],
      });
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      if (lobFilter !== 'ALL') params.lob = lobFilter;
      if (insurerFilter) params.insurer = insurerFilter;
      if (productLineFilter) params.productLine = productLineFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await pospCategoryAPI.getProducts(params);
      const data = res.data || res || {};
      setProducts(data.data || data.products || data || []);
      setTotalProducts(data.total || data.count || 0);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, lobFilter, insurerFilter, productLineFilter, searchQuery]);

  useEffect(() => {
    fetchStats();
    fetchFilterOptions();
  }, [fetchStats, fetchFilterOptions]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [lobFilter, insurerFilter, productLineFilter, searchQuery]);

  // ─── Handlers ─────────────────────────────

  const handleResetFilters = () => {
    setLobFilter('ALL');
    setInsurerFilter('');
    setProductLineFilter('');
    setSearchQuery('');
    setPage(1);
  };

  const handleSeedProducts = async () => {
    try {
      setSeeding(true);
      setError(null);
      setSeedSuccess(null);
      await pospCategoryAPI.seedProducts([]);
      setSeedSuccess('Products seeded successfully! Refreshing catalog...');
      await Promise.all([fetchStats(), fetchFilterOptions(), fetchProducts()]);
      setTimeout(() => setSeedSuccess(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to seed products');
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenCalc = (productId) => {
    if (calcOpenId === productId) {
      setCalcOpenId(null);
      setCalcResult(null);
      return;
    }
    setCalcOpenId(productId);
    setCalcCategory('A');
    setCalcPremium('');
    setCalcResult(null);
  };

  const handleCalculate = async (product) => {
    if (!calcPremium || parseFloat(calcPremium) <= 0) return;
    try {
      setCalculating(true);
      setCalcResult(null);
      const res = await pospCategoryAPI.quickCalculate({
        productId: product.id,
        pospCategory: calcCategory,
        premiumAmount: parseFloat(calcPremium),
        lob: product.lob,
      });
      setCalcResult(res.data || res || {});
    } catch (err) {
      setCalcResult({ error: err.response?.data?.message || 'Calculation failed' });
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  // ─── Derived Data ─────────────────────────

  const filteredProductLines = filterOptions.productLines.filter((pl) => {
    if (lobFilter === 'ALL') return true;
    return pl.lob === lobFilter;
  });

  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  const hasActiveFilters = lobFilter !== 'ALL' || insurerFilter || productLineFilter || searchQuery;

  // ─── Render ───────────────────────────────

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

      {/* ──── Header ──── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-teal-100">
            <Package className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Product Commission Catalog
            </h1>
            <p className="text-gray-600 mt-1">
              Browse {stats.total || 245} products across General, Life & Health Insurance
            </p>
          </div>
        </div>
        <button
          onClick={handleSeedProducts}
          disabled={seeding}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-sm"
        >
          <Database className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
          {seeding ? 'Seeding...' : 'Seed Products'}
        </button>
      </div>

      {/* ──── Alerts ──── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
      {seedSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">{seedSuccess}</p>
        </div>
      )}

      {/* ──── Stats Cards ──── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'teal', bg: 'bg-teal-100', iconColor: 'text-teal-700', valueColor: 'text-teal-600' },
          { label: 'GI Products', value: stats.gi, icon: Shield, color: 'blue', bg: 'bg-blue-100', iconColor: 'text-blue-700', valueColor: 'text-blue-600' },
          { label: 'LI Products', value: stats.li, icon: TrendingUp, color: 'purple', bg: 'bg-purple-100', iconColor: 'text-purple-700', valueColor: 'text-purple-600' },
          { label: 'HI Products', value: stats.hi, icon: Heart, color: 'green', bg: 'bg-green-100', iconColor: 'text-green-700', valueColor: 'text-green-600' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${card.valueColor}`}>{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ──── Filter Bar ──── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        {/* LOB Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {LOB_TABS.map((tab) => {
            const isActive = lobFilter === tab.key;
            const count =
              tab.key === 'ALL'
                ? stats.total
                : tab.key === 'GI'
                ? stats.gi
                : tab.key === 'LI'
                ? stats.li
                : stats.hi;
            const colors =
              tab.key !== 'ALL' && LOB_COLORS[tab.key]
                ? LOB_COLORS[tab.key]
                : { accent: 'bg-teal-600', light: 'bg-teal-50' };

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setLobFilter(tab.key);
                  setProductLineFilter('');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? `${colors.accent} text-white shadow-sm`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Insurer Dropdown */}
          <div className="relative flex-1 min-w-[180px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={insurerFilter}
              onChange={(e) => setInsurerFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
            >
              <option value="">All Insurers</option>
              {filterOptions.insurers.map((ins) => (
                <option key={ins} value={ins}>
                  {ins}
                </option>
              ))}
            </select>
          </div>

          {/* Product Line Dropdown */}
          <div className="relative flex-1 min-w-[180px]">
            <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={productLineFilter}
              onChange={(e) => setProductLineFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none"
            >
              <option value="">All Product Lines</option>
              {filteredProductLines.map((pl) => {
                const label = typeof pl === 'string' ? pl : pl.name || pl.label || pl;
                const value = typeof pl === 'string' ? pl : pl.value || pl.name || pl;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or insurer..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ──── Product Table ──── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Products</h2>
            <span className="text-sm text-gray-500 ml-1">
              ({totalProducts} {totalProducts === 1 ? 'product' : 'products'})
            </span>
          </div>
          {totalProducts > 0 && (
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(page * ITEMS_PER_PAGE, totalProducts)} of {totalProducts}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-700">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query.'
                : 'Click "Seed Products" to populate the catalog.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-700">Product Line</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-700">Product Name</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-700">Insurer</th>
                  <th className="px-5 py-3 text-center font-medium text-gray-700">
                    Trustner Commission (%)
                  </th>
                  <th className="px-5 py-3 text-center font-medium text-gray-700">Basis</th>
                  <th className="px-5 py-3 text-center font-medium text-gray-700">Tier</th>
                  <th className="px-5 py-3 text-center font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => {
                  const commission = parseFloat(product.trustnerCommission ?? product.commissionPct ?? 0);
                  const tierInfo = getCommissionTier(commission);
                  const commBadge = getCommissionBadgeColor(commission);
                  const lobBadge = getLobBadge(product.lob);
                  const isCalcOpen = calcOpenId === product.id;

                  return (
                    <React.Fragment key={product.id || idx}>
                      {/* Product Row */}
                      <tr
                        className={`border-t border-gray-200 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-teal-50/50 transition-colors`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {product.lob && (
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${lobBadge}`}
                              >
                                {product.lob}
                              </span>
                            )}
                            <span className="text-gray-700 text-sm">
                              {product.productLine || product.category || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-900">
                          {product.productName || product.name || '-'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {product.insurer || product.insurerName || product.companyName || '-'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${commBadge}`}
                          >
                            {commission.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center text-gray-600 text-xs">
                          {product.basis || product.commissionBasis || 'Net Premium'}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${tierInfo.color}`}
                          >
                            {tierInfo.tier}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleOpenCalc(product.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              isCalcOpen
                                ? 'bg-teal-600 text-white'
                                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                            }`}
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            {isCalcOpen ? 'Close' : 'Calculate'}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Calculator Row */}
                      {isCalcOpen && (
                        <tr className="border-t border-teal-200">
                          <td colSpan="7" className="p-0">
                            <div className="bg-teal-50/70 border-l-4 border-teal-500 px-6 py-4">
                              <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
                                {/* Category Select */}
                                <div className="flex-1 min-w-[180px]">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    POSP Category
                                  </label>
                                  <select
                                    value={calcCategory}
                                    onChange={(e) => {
                                      setCalcCategory(e.target.value);
                                      setCalcResult(null);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                  >
                                    {CATEGORIES.map((cat) => (
                                      <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Premium Input */}
                                <div className="flex-1 min-w-[180px]">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Premium Amount
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                      &#8377;
                                    </span>
                                    <input
                                      type="number"
                                      value={calcPremium}
                                      onChange={(e) => {
                                        setCalcPremium(e.target.value);
                                        setCalcResult(null);
                                      }}
                                      placeholder="e.g. 25000"
                                      min="0"
                                      className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                  </div>
                                </div>

                                {/* Calculate Button */}
                                <button
                                  onClick={() => handleCalculate(product)}
                                  disabled={calculating || !calcPremium || parseFloat(calcPremium) <= 0}
                                  className="flex items-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
                                >
                                  <Calculator className={`w-4 h-4 ${calculating ? 'animate-pulse' : ''}`} />
                                  {calculating ? 'Calculating...' : 'Calculate'}
                                </button>
                              </div>

                              {/* Result Display */}
                              {calcResult && (
                                <div className="mt-4">
                                  {calcResult.error ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                      <p className="text-sm text-red-700">{calcResult.error}</p>
                                    </div>
                                  ) : (
                                    <div className="bg-white border border-teal-200 rounded-lg p-4 shadow-sm">
                                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        Payout Breakdown
                                      </h4>
                                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                          <p className="text-xs text-gray-500">Agent Payout %</p>
                                          <p className="text-lg font-bold text-teal-700">
                                            {(calcResult.agentPayoutPct ?? calcResult.pospPayout ?? calcResult.payoutPct ?? 0).toFixed(2)}%
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Agent Payout Amount</p>
                                          <p className="text-lg font-bold text-teal-700">
                                            {formatCurrency(
                                              calcResult.agentPayoutAmount ??
                                                calcResult.pospAmount ??
                                                calcResult.payoutAmount ??
                                                0
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Trustner Retention</p>
                                          <p className="text-lg font-bold text-gray-700">
                                            {formatCurrency(
                                              calcResult.trustnerRetention ??
                                                calcResult.dstRetention ??
                                                calcResult.retentionAmount ??
                                                0
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Total Commission</p>
                                          <p className="text-lg font-bold text-gray-900">
                                            {formatCurrency(
                                              calcResult.totalCommission ??
                                                calcResult.grossCommission ??
                                                calcResult.commissionAmount ??
                                                0
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ──── Pagination ──── */}
        {!loading && totalProducts > ITEMS_PER_PAGE && (
          <div className="border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} ({totalProducts} products)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page <= 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Number Buttons */}
              <div className="hidden sm:flex items-center gap-1">
                {(() => {
                  const pages = [];
                  let start = Math.max(1, page - 2);
                  let end = Math.min(totalPages, page + 2);
                  if (end - start < 4) {
                    if (start === 1) end = Math.min(totalPages, start + 4);
                    else start = Math.max(1, end - 4);
                  }
                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          i === page
                            ? 'bg-teal-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogPage;
