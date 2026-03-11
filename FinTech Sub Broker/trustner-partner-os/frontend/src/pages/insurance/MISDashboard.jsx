import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Plus,
  Upload,
  Download,
  AlertCircle,
  TrendingUp,
  DollarSign,
  CalendarDays,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import misAPI from '../../services/mis';
import { formatCurrency, formatIndianNumber, formatDate } from '../../utils/formatters';

const LOB_LABELS = {
  MOTOR_TWO_WHEELER: 'Motor 2W',
  MOTOR_FOUR_WHEELER: 'Motor 4W',
  MOTOR_COMMERCIAL: 'Motor Comm.',
  HEALTH_INDIVIDUAL: 'Health Ind.',
  HEALTH_FAMILY_FLOATER: 'Health FF',
  HEALTH_GROUP: 'Health Grp',
  HEALTH_CRITICAL_ILLNESS: 'Health CI',
  HEALTH_TOP_UP: 'Health Top-Up',
  LIFE_TERM: 'Life Term',
  LIFE_ENDOWMENT: 'Life Endow.',
  LIFE_ULIP: 'Life ULIP',
  LIFE_WHOLE_LIFE: 'Life WL',
  TRAVEL: 'Travel',
  HOME: 'Home',
  FIRE: 'Fire',
  MARINE: 'Marine',
  LIABILITY: 'Liability',
  PA_PERSONAL_ACCIDENT: 'PA',
  CYBER: 'Cyber',
};

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800',
  VERIFIED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  AMENDMENT_REQUESTED: 'bg-orange-100 text-orange-800',
};

const MISDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEntries: 0,
    pendingVerification: 0,
    verified: 0,
    rejected: 0,
    todaysEntries: 0,
    totalPremium: 0,
    totalCommission: 0,
  });
  const [departmentData, setDepartmentData] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, entriesRes] = await Promise.all([
        misAPI.getStats(),
        misAPI.getEntries({ limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);

      const data = statsRes.data;
      setStats({
        totalEntries: data.totalEntries || 0,
        pendingVerification: data.pendingVerification || 0,
        verified: data.verified || 0,
        rejected: data.rejected || 0,
        todaysEntries: data.todaysEntries || 0,
        totalPremium: data.totalPremium || 0,
        totalCommission: data.totalCommission || 0,
      });

      setDepartmentData(data.departmentBreakdown || [
        { department: 'Health', entries: 0, premium: 0 },
        { department: 'Life', entries: 0, premium: 0 },
        { department: 'General', entries: 0, premium: 0 },
      ]);

      setRecentEntries(entriesRes.data?.data || entriesRes.data || []);
    } catch (err) {
      setError('Failed to load MIS dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading MIS dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">MIS Dashboard</h1>
          <p className="text-gray-600 mt-2">Management Information System overview</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/insurance/mis/entry')}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New MIS Entry
          </button>
          <button
            onClick={() => navigate('/insurance/mis/entry?tab=upload')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => navigate('/insurance/mis/reports')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Generate Report
          </button>
        </div>
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatIndianNumber(stats.totalEntries)}</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-600">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{formatIndianNumber(stats.pendingVerification)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatIndianNumber(stats.verified)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-600">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{formatIndianNumber(stats.rejected)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-600">
              <XCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Entries</p>
              <p className="text-2xl font-bold text-teal-600 mt-2">{formatIndianNumber(stats.todaysEntries)}</p>
            </div>
            <div className="p-3 rounded-lg bg-teal-500">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Premium & Commission Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-teal-100">
              <DollarSign className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Premium Collected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalPremium)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Commission Earned</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalCommission)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Department-wise Breakdown</h2>
        {departmentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="department" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="entries" name="Entries" fill="#0d9488" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="premium" name="Premium" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No department data available
          </div>
        )}
      </div>

      {/* Recent Entries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Entries</h2>
            <button
              onClick={() => navigate('/insurance/mis/verification')}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-900">MIS Code</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Company</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">LOB</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Net Premium</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">POSP</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Location</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Month</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.length > 0 ? (
                recentEntries.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    onClick={() => navigate(`/insurance/mis/entries/${entry.id}`)}
                    className={`border-t border-gray-200 cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-teal-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-teal-600">{entry.misCode || '-'}</td>
                    <td className="px-6 py-4 text-gray-900">{entry.customerName}</td>
                    <td className="px-6 py-4 text-gray-600">{entry.insurerName || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{LOB_LABELS[entry.lob] || entry.lob}</td>
                    <td className="px-6 py-4 text-right font-bold text-teal-600">
                      {formatCurrency(entry.netPremium || entry.grossPremium)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{entry.pospName || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{entry.employeeLocation || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[entry.status] || 'bg-gray-100 text-gray-800'}`}>
                        {entry.status?.replace(/_/g, ' ') || 'DRAFT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{entry.entryMonth || formatDate(entry.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    No MIS entries found. Create your first entry to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MISDashboard;
