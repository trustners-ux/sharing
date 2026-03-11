import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Plus,
  AlertCircle,
  Calendar,
  Users,
  Target,
  X,
  Trash2,
  Play,
  Eye,
} from 'lucide-react';
import misAPI from '../../services/mis';
import { formatDate } from '../../utils/formatters';

const CONTEST_TYPES = [
  { value: 'PREMIUM_BASED', label: 'Premium Based' },
  { value: 'POLICY_COUNT', label: 'Policy Count' },
  { value: 'NEW_CUSTOMER', label: 'New Customer Acquisition' },
  { value: 'RENEWAL', label: 'Renewal Performance' },
  { value: 'COMPOSITE', label: 'Composite (Multi-Metric)' },
];

const METRIC_TYPES = [
  { value: 'TOTAL_PREMIUM', label: 'Total Premium' },
  { value: 'POLICY_COUNT', label: 'Policy Count' },
  { value: 'NEW_CUSTOMERS', label: 'New Customers' },
  { value: 'RENEWALS', label: 'Renewals' },
  { value: 'CROSS_SELL', label: 'Cross Sell' },
  { value: 'HEALTH_PREMIUM', label: 'Health Premium' },
  { value: 'LIFE_PREMIUM', label: 'Life Premium' },
  { value: 'MOTOR_PREMIUM', label: 'Motor Premium' },
];

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const ContestManagement = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [metrics, setMetrics] = useState([]);
  const [metricForm, setMetricForm] = useState({ type: '', weight: '', target: '' });

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await misAPI.getContests();
      setContests(res.data?.data || res.data || []);
    } catch (err) {
      setError('Failed to load contests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMetric = () => {
    if (!metricForm.type || !metricForm.weight) return;
    setMetrics((prev) => [
      ...prev,
      {
        ...metricForm,
        weight: parseFloat(metricForm.weight),
        target: metricForm.target ? parseFloat(metricForm.target) : undefined,
        _id: Date.now(),
      },
    ]);
    setMetricForm({ type: '', weight: '', target: '' });
  };

  const handleRemoveMetric = (id) => {
    setMetrics((prev) => prev.filter((m) => m._id !== id));
  };

  const handleCreateContest = async () => {
    try {
      setCreating(true);
      setError(null);
      const payload = {
        ...form,
        metrics: metrics.map(({ _id, ...m }) => m),
      };
      await misAPI.createContest(payload);
      setShowCreateModal(false);
      setForm({ name: '', type: '', startDate: '', endDate: '', description: '' });
      setMetrics([]);
      fetchContests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contest');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleActivateContest = async (id) => {
    try {
      await misAPI.activateContest(id);
      fetchContests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate contest');
      console.error(err);
    }
  };

  const activeContests = contests.filter((c) => c.status === 'ACTIVE');

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contest Management</h1>
          <p className="text-gray-600 mt-2">Create and manage sales contests for POSPs</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Contest
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Active Contests */}
      {activeContests.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Contests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeContests.map((contest) => {
              const startDate = new Date(contest.startDate);
              const endDate = new Date(contest.endDate);
              const now = new Date();
              const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
              const elapsed = Math.max(0, (now - startDate) / (1000 * 60 * 60 * 24));
              const progress = totalDays > 0 ? Math.min(100, (elapsed / totalDays) * 100) : 0;

              return (
                <div
                  key={contest.id}
                  onClick={() => navigate(`/insurance/mis/contests/${contest.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold text-gray-900">{contest.name}</h3>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{contest.type?.replace(/_/g, ' ')}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
                    </span>
                    {contest.participantCount !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {contest.participantCount}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Contests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">All Contests</h2>
            <span className="text-sm text-gray-500 ml-2">({contests.length})</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Type</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Start Date</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">End Date</th>
                <th className="px-6 py-3 text-center font-medium text-gray-900">Participants</th>
                <th className="px-6 py-3 text-center font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.length > 0 ? (
                contests.map((contest, idx) => (
                  <tr
                    key={contest.id}
                    className={`border-t border-gray-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-teal-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{contest.name}</td>
                    <td className="px-6 py-4 text-gray-600">{contest.type?.replace(/_/g, ' ')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[contest.status] || 'bg-gray-100 text-gray-800'}`}>
                        {contest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(contest.startDate)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(contest.endDate)}</td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {contest.participantCount ?? contest.participants?.length ?? '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/insurance/mis/contests/${contest.id}`)}
                          className="flex items-center gap-1 px-2 py-1 text-teal-600 hover:bg-teal-50 rounded text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        {contest.status === 'DRAFT' && (
                          <button
                            onClick={() => handleActivateContest(contest.id)}
                            className="flex items-center gap-1 px-2 py-1 text-green-600 hover:bg-green-50 rounded text-xs font-medium transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No contests created yet</p>
                    <p className="text-sm mt-1">Create your first contest to motivate your team</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Contest Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900">Create New Contest</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contest Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Q1 Health Premium Challenge"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contest Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Type</option>
                  {CONTEST_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Contest description..."
                />
              </div>

              {/* Metrics Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contest Metrics</label>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={metricForm.type}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, type: e.target.value }))}
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Metric Type</option>
                      {METRIC_TYPES.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Weight %"
                      value={metricForm.weight}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, weight: e.target.value }))}
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min="0"
                      max="100"
                    />
                    <input
                      type="number"
                      placeholder="Target"
                      value={metricForm.target}
                      onChange={(e) => setMetricForm((prev) => ({ ...prev, target: e.target.value }))}
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={handleAddMetric}
                    disabled={!metricForm.type || !metricForm.weight}
                    className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border border-dashed border-teal-400 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Metric
                  </button>

                  {metrics.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-gray-200">
                      {metrics.map((metric) => (
                        <div key={metric._id} className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <Target className="w-3.5 h-3.5 text-teal-600" />
                            <span className="text-sm text-gray-900">
                              {METRIC_TYPES.find((m) => m.value === metric.type)?.label || metric.type}
                            </span>
                            <span className="text-xs text-gray-500">({metric.weight}%)</span>
                            {metric.target && (
                              <span className="text-xs text-gray-500">Target: {metric.target}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveMetric(metric._id)}
                            className="p-1 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateContest}
                  disabled={creating || !form.name || !form.type || !form.startDate || !form.endDate}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Contest'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestManagement;
