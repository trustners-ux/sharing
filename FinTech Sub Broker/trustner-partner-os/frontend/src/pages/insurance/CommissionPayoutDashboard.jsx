import React, { useState, useEffect } from 'react';
import {
  IndianRupee, Users, CheckCircle, Clock, AlertCircle, X,
  TrendingUp, Banknote, FileText, Download, Search, Filter,
  Building2, ChevronRight, Calendar, RefreshCw, Send,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { commissionsAPI } from '../../services/commissions';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  ON_HOLD: 'bg-red-100 text-red-700',
  FAILED: 'bg-red-100 text-red-700',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CommissionPayoutDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payouts');
  const [notification, setNotification] = useState(null);

  // Filters
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Data
  const [payouts, setPayouts] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [slabs, setSlabs] = useState([]);
  const [stats, setStats] = useState({
    totalPayouts: 0, totalGross: 0, totalTDS: 0, totalGST: 0,
    totalNet: 0, pendingCount: 0, paidCount: 0, approvedCount: 0,
  });

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showSlabModal, setShowSlabModal] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    fetchData();
  }, [month, year, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { month, year, status: statusFilter || undefined };
      const [payoutsRes, receivablesRes, payablesRes] = await Promise.allSettled([
        commissionsAPI.getPayouts(params),
        commissionsAPI.getReceivables(params),
        commissionsAPI.getPayables(params),
      ]);

      const payoutData = payoutsRes.status === 'fulfilled' ? (payoutsRes.value.data || payoutsRes.value || []) : [];
      setPayouts(Array.isArray(payoutData) ? payoutData : []);
      setReceivables(receivablesRes.status === 'fulfilled' ? (receivablesRes.value.data || receivablesRes.value || []) : []);
      setPayables(payablesRes.status === 'fulfilled' ? (payablesRes.value.data || payablesRes.value || []) : []);

      // Calc stats from payouts
      const arr = Array.isArray(payoutData) ? payoutData : [];
      setStats({
        totalPayouts: arr.length,
        totalGross: arr.reduce((s, p) => s + (Number(p.grossAmount) || 0), 0),
        totalTDS: arr.reduce((s, p) => s + (Number(p.tdsAmount) || 0), 0),
        totalGST: arr.reduce((s, p) => s + (Number(p.gstAmount) || 0), 0),
        totalNet: arr.reduce((s, p) => s + (Number(p.finalAmount) || 0), 0),
        pendingCount: arr.filter(p => p.status === 'PENDING').length,
        approvedCount: arr.filter(p => p.status === 'APPROVED').length,
        paidCount: arr.filter(p => p.status === 'PAID').length,
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayouts = async () => {
    setProcessingAction(true);
    try {
      await commissionsAPI.generatePayouts({ month, year });
      setNotification({ type: 'success', msg: `Payouts generated for ${MONTHS[month - 1]} ${year}` });
      setShowGenerateModal(false);
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', msg: err?.response?.data?.message || 'Failed to generate payouts' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleApprovePayout = async (id) => {
    try {
      await commissionsAPI.approvePayout(id);
      setNotification({ type: 'success', msg: 'Payout approved' });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to approve' });
    }
  };

  const handleMarkPaid = async (id) => {
    const bankRef = prompt('Enter bank reference number (UTR):');
    if (!bankRef) return;
    try {
      await commissionsAPI.markPaid(id, { bankRefNumber: bankRef });
      setNotification({ type: 'success', msg: 'Payout marked as paid' });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', msg: 'Failed to mark paid' });
    }
  };

  const handleBatchCalculate = async () => {
    setProcessingAction(true);
    try {
      await commissionsAPI.batchCalculate({ month, year });
      setNotification({ type: 'success', msg: 'Batch calculation completed' });
      fetchData();
    } catch (err) {
      setNotification({ type: 'error', msg: 'Batch calculation failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const filteredPayouts = (Array.isArray(payouts) ? payouts : []).filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (p.payoutCode || '').toLowerCase().includes(q) ||
           (p.subBroker?.firstName || '').toLowerCase().includes(q) ||
           (p.subBroker?.agentCode || '').toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{notification.msg}</span>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4 ml-2" /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission & Payout Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage insurance commissions, payouts, and reconciliation</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleBatchCalculate} disabled={processingAction}
            className="flex items-center gap-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 text-sm font-medium disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${processingAction ? 'animate-spin' : ''}`} /> Batch Calculate
          </button>
          <button onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
            <Banknote className="w-4 h-4" /> Generate Payouts
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">All Status</option>
          {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Payouts', value: stats.totalPayouts, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Gross Amount', value: formatCurrency(stats.totalGross), icon: IndianRupee, color: 'text-teal-600 bg-teal-50' },
          { label: 'TDS Deducted', value: formatCurrency(stats.totalTDS), icon: ArrowDownRight, color: 'text-red-600 bg-red-50' },
          { label: 'GST', value: formatCurrency(stats.totalGST), icon: FileText, color: 'text-orange-600 bg-orange-50' },
          { label: 'Net Payable', value: formatCurrency(stats.totalNet), icon: Banknote, color: 'text-green-600 bg-green-50' },
          { label: 'Pending / Paid', value: `${stats.pendingCount} / ${stats.paidCount}`, icon: Clock, color: 'text-purple-600 bg-purple-50' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color} mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Tab toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        {[
          { id: 'payouts', label: 'Payouts', icon: Banknote },
          { id: 'receivables', label: 'Receivables (from Insurers)', icon: ArrowUpRight },
          { id: 'payables', label: 'Payables (to Agents)', icon: ArrowDownRight },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Search by code, agent name, or agent code..." />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading payouts...</p>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="p-8 text-center">
              <Banknote className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No payouts found for {MONTHS[month - 1]} {year}</p>
              <p className="text-xs text-gray-400 mt-1">Click "Generate Payouts" to create payout records</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Payout Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Agent</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Gross</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">TDS</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">GST</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Clawback</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Net Payable</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{payout.payoutCode}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{payout.subBroker?.firstName || payout.subBrokerId || '-'} {payout.subBroker?.lastName || ''}</p>
                        <p className="text-xs text-gray-500">{payout.subBroker?.agentCode || ''}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(payout.grossAmount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(payout.tdsAmount)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(payout.gstAmount)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(payout.clawbackAmount)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">{formatCurrency(payout.finalAmount)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[payout.status] || 'bg-gray-100 text-gray-600'}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {payout.status === 'PENDING' && (
                            <button onClick={() => handleApprovePayout(payout.id)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium">
                              Approve
                            </button>
                          )}
                          {payout.status === 'APPROVED' && (
                            <button onClick={() => handleMarkPaid(payout.id)}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium">
                              Mark Paid
                            </button>
                          )}
                          {payout.status === 'PAID' && payout.bankRefNumber && (
                            <span className="text-xs text-gray-500">UTR: {payout.bankRefNumber}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Receivables Tab */}
      {activeTab === 'receivables' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-green-600" /> Receivables from Insurance Companies
          </h3>
          {Array.isArray(receivables) && receivables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Company</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Policies</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Total Premium</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Commission Due</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Received</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {receivables.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">{row.companyName || row.company || '-'}</td>
                      <td className="px-4 py-3 text-right">{row.policyCount || row.count || 0}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(row.totalPremium || 0)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.commissionDue || row.totalCommission || 0)}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatCurrency(row.received || 0)}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-bold">{formatCurrency(row.pending || (row.commissionDue || 0) - (row.received || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No receivables data for this period</p>
            </div>
          )}
        </div>
      )}

      {/* Payables Tab */}
      {activeTab === 'payables' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowDownRight className="w-5 h-5 text-red-600" /> Payables to POSP Agents
          </h3>
          {Array.isArray(payables) && payables.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Code</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Policies</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Commission</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">TDS</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">GST</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">Net Payable</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payables.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="px-4 py-3 font-medium">{row.agentName || row.name || '-'}</td>
                      <td className="px-4 py-3 text-gray-500">{row.agentCode || '-'}</td>
                      <td className="px-4 py-3 text-right">{row.policyCount || 0}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(row.totalCommission || 0)}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(row.tds || 0)}</td>
                      <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(row.gst || 0)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-700">{formatCurrency(row.netPayable || 0)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-600'}`}>
                          {row.status || 'PENDING'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No payables data for this period</p>
            </div>
          )}
        </div>
      )}

      {/* Generate Payouts Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Generate Payouts</h3>
              <button onClick={() => setShowGenerateModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-600">
              This will calculate and create payout records for all POSPs with approved commissions for <strong>{MONTHS[month - 1]} {year}</strong>.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
              Payout generation aggregates all approved commissions, applies TDS (10%) and GST (18%), and creates individual payout records.
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleGeneratePayouts} disabled={processingAction}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm disabled:opacity-50">
                {processingAction ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionPayoutDashboard;
