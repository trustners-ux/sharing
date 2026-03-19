import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

// Prisma PolicyStatus enum → display map
const STATUS_MAP = {
  QUOTE_GENERATED: { label: 'Quote', color: 'bg-blue-100 text-blue-800' },
  PROPOSAL_SUBMITTED: { label: 'Proposal', color: 'bg-indigo-100 text-indigo-800' },
  PROPOSAL_UNDER_REVIEW: { label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: 'bg-yellow-100 text-yellow-800' },
  PAYMENT_RECEIVED: { label: 'Payment Received', color: 'bg-cyan-100 text-cyan-800' },
  POLICY_ISSUED: { label: 'Issued', color: 'bg-teal-100 text-teal-800' },
  POLICY_ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-800' },
  POLICY_EXPIRED: { label: 'Expired', color: 'bg-red-100 text-red-800' },
  POLICY_CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  POLICY_LAPSED: { label: 'Lapsed', color: 'bg-orange-100 text-orange-800' },
  CLAIM_IN_PROGRESS: { label: 'Claim In Progress', color: 'bg-amber-100 text-amber-800' },
  ENDORSEMENT_IN_PROGRESS: { label: 'Endorsement', color: 'bg-lime-100 text-lime-800' },
};

// Prisma InsuranceLOB enum → display map
const LOB_MAP = {
  MOTOR_TWO_WHEELER: 'Motor 2W',
  MOTOR_FOUR_WHEELER: 'Motor 4W',
  MOTOR_COMMERCIAL: 'Motor CV',
  HEALTH_INDIVIDUAL: 'Health Individual',
  HEALTH_FAMILY_FLOATER: 'Health Family',
  HEALTH_GROUP: 'Health Group',
  HEALTH_CRITICAL_ILLNESS: 'Critical Illness',
  HEALTH_TOP_UP: 'Health Top-Up',
  LIFE_TERM: 'Life Term',
  LIFE_ENDOWMENT: 'Life Endowment',
  LIFE_ULIP: 'Life ULIP',
  LIFE_WHOLE_LIFE: 'Life Whole',
  TRAVEL: 'Travel',
  HOME: 'Home',
  FIRE: 'Fire',
  MARINE: 'Marine',
  LIABILITY: 'Liability',
  PA: 'Personal Accident',
  OTHER: 'Other',
};

const PoliciesPage = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const pageSize = 20;
  const [filters, setFilters] = useState({
    lob: '',
    status: '',
  });
  const [summary, setSummary] = useState({
    totalPolicies: 0,
    activeCount: 0,
    expiredCount: 0,
    cancelledCount: 0,
    totalPremium: 0,
  });

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params for backend
      const params = {
        skip: page * pageSize,
        take: pageSize,
      };
      if (filters.lob) params.lob = filters.lob;
      if (filters.status) params.status = filters.status;
      if (searchQuery) params.search = searchQuery;

      // Fetch policies list + stats in parallel
      // Backend: GET /insurance/policies returns { data: [...], pagination: { total, skip, take, pages } }
      // Backend: GET /insurance/policies/stats/overview returns { totalPolicies, activeCount, expiredCount, cancelledCount, totalPremium, totalGWP }
      const [policiesRes, statsRes] = await Promise.allSettled([
        api.get('/insurance/policies', { params }),
        api.get('/insurance/policies/stats/overview'),
      ]);

      if (policiesRes.status === 'fulfilled') {
        // Response auto-unwrapped by interceptor: { data: [...], pagination: {...} }
        const result = policiesRes.value;
        setPolicies(result.data || []);
        setPagination(result.pagination || { total: 0, pages: 0 });
      } else {
        console.error('Policies fetch error:', policiesRes.reason);
        setError('Failed to load policies');
      }

      if (statsRes.status === 'fulfilled') {
        setSummary(statsRes.value);
      }
    } catch (err) {
      setError('Failed to load policies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchData();
  };

  const handleExport = async () => {
    try {
      // Use bulk export endpoint
      const params = {};
      if (filters.lob) params.lob = filters.lob;
      if (filters.status) params.status = filters.status;

      const res = await api.get('/insurance/policies/export/bulk', { params });
      // res is auto-unwrapped: { count, data: [...] }
      const exportData = res.data || [];

      // Convert to CSV and download
      if (exportData.length === 0) {
        alert('No data to export');
        return;
      }

      const headers = ['Policy No', 'Internal Ref', 'Customer', 'Phone', 'LOB', 'Status', 'Sum Insured', 'Total Premium', 'Net Premium', 'Start Date', 'End Date', 'Company', 'POSP'];
      const rows = exportData.map(p => [
        p.policyNumber,
        p.internalRefCode,
        p.customerName,
        p.customerPhone || '',
        LOB_MAP[p.lob] || p.lob,
        STATUS_MAP[p.status]?.label || p.status,
        p.sumInsured || 0,
        p.totalPremium || 0,
        p.netPremium || 0,
        p.startDate ? new Date(p.startDate).toLocaleDateString('en-IN') : '',
        p.endDate ? new Date(p.endDate).toLocaleDateString('en-IN') : '',
        p.company?.companyName || '',
        p.posp ? `${p.posp.firstName || ''} ${p.posp.lastName || ''}`.trim() : '',
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `policies-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export policies');
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading && policies.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-2">View and manage all insurance policies</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={fetchData} className="text-red-600 hover:text-red-800">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Policies', value: summary.totalPolicies, color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Active', value: summary.activeCount, color: 'text-green-800', bg: 'bg-green-50 border-green-200' },
          { label: 'Expired', value: summary.expiredCount, color: 'text-red-800', bg: 'bg-red-50 border-red-200' },
          { label: 'Cancelled', value: summary.cancelledCount, color: 'text-gray-800', bg: 'bg-gray-50 border-gray-200' },
          { label: 'Total Premium', value: formatCurrency(summary.totalPremium), color: 'text-teal-800', bg: 'bg-teal-50 border-teal-200' },
        ].map((card, idx) => (
          <div key={idx} className={`rounded-lg border p-4 ${card.bg}`}>
            <p className="text-xs text-gray-600 font-medium">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by policy number, customer name, phone, vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={filters.lob}
            onChange={(e) => { setFilters({ ...filters, lob: e.target.value }); setPage(0); }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">All LOB</option>
            {Object.entries(LOB_MAP).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(0); }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">All Status</option>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Policy No</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">LOB</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Company</th>
                <th className="px-4 py-3 text-right font-medium text-gray-900">Premium</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">Start</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">End</th>
                <th className="px-4 py-3 text-left font-medium text-gray-900">POSP</th>
                <th className="px-4 py-3 text-center font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {policies.length > 0 ? (
                policies.map((policy, idx) => {
                  const statusInfo = STATUS_MAP[policy.status] || { label: policy.status, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr
                      key={policy.id}
                      className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors cursor-pointer`}
                      onClick={() => navigate(`/insurance/policies/${policy.id}`)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                        {policy.policyNumber}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                        {policy.customerName}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {LOB_MAP[policy.lob] || policy.lob}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {policy.company?.companyName || '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-teal-600 whitespace-nowrap">
                        {formatCurrency(policy.totalPremium)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(policy.startDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(policy.endDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-[120px] truncate">
                        {policy.posp ? `${policy.posp.firstName || ''} ${policy.posp.lastName || ''}`.trim() : '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/insurance/policies/${policy.id}`); }}
                          className="text-teal-600 hover:text-teal-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Loading...' : 'No policies found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(pagination.pages - 1, page + 1))}
                disabled={page >= pagination.pages - 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
