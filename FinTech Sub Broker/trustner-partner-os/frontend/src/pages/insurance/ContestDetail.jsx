import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Target,
  AlertCircle,
  Calendar,
  Users,
  Calculator,
  Lock,
  Medal,
  BarChart3,
} from 'lucide-react';
import misAPI from '../../services/mis';
import { formatCurrency, formatDate, formatIndianNumber } from '../../utils/formatters';

const METRIC_LABELS = {
  TOTAL_PREMIUM: 'Total Premium',
  POLICY_COUNT: 'Policy Count',
  NEW_CUSTOMERS: 'New Customers',
  RENEWALS: 'Renewals',
  CROSS_SELL: 'Cross Sell',
  HEALTH_PREMIUM: 'Health Premium',
  LIFE_PREMIUM: 'Life Premium',
  MOTOR_PREMIUM: 'Motor Premium',
};

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const ContestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchContestData();
  }, [id]);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      const [contestRes, leaderboardRes] = await Promise.all([
        misAPI.getContest(id),
        misAPI.getLeaderboard(id),
      ]);
      setContest(contestRes.data);
      setLeaderboard(leaderboardRes.data?.data || leaderboardRes.data || []);
    } catch (err) {
      setError('Failed to load contest details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateScores = async () => {
    try {
      setCalculating(true);
      setError(null);
      await misAPI.calculateContest(id);
      fetchContestData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate scores');
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const handleCloseContest = async () => {
    if (!window.confirm('Are you sure you want to close this contest? This action cannot be undone.')) return;
    try {
      setClosing(true);
      setError(null);
      await misAPI.closeContest(id);
      fetchContestData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close contest');
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-700 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-white text-gray-600 border-gray-200';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) return <Medal className="w-4 h-4" />;
    return null;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contest details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !contest) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="font-medium text-red-900">{error}</h3>
          <button
            onClick={() => navigate('/insurance/mis/contests')}
            className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Back to Contests
          </button>
        </div>
      </div>
    );
  }

  if (!contest) return null;

  const contestMetrics = contest.metrics || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h1 className="text-2xl font-bold text-gray-900">{contest.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[contest.status] || 'bg-gray-100 text-gray-800'}`}>
                {contest.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">
              {contest.type?.replace(/_/g, ' ')} &middot;{' '}
              {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {contest.status === 'ACTIVE' && (
            <>
              <button
                onClick={handleCalculateScores}
                disabled={calculating}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Calculator className="w-4 h-4" />
                {calculating ? 'Calculating...' : 'Calculate Scores'}
              </button>
              <button
                onClick={handleCloseContest}
                disabled={closing}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {closing ? 'Closing...' : 'Close Contest'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Contest Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-100">
              <Calendar className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-bold text-gray-900">
                {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Participants</p>
              <p className="text-sm font-bold text-gray-900">
                {contest.participantCount ?? leaderboard.length ?? 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Target className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Metrics</p>
              <p className="text-sm font-bold text-gray-900">{contestMetrics.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <BarChart3 className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-bold text-gray-900">{contest.type?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      {contestMetrics.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contest Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contestMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-teal-600" />
                  <h4 className="text-sm font-bold text-gray-900">
                    {METRIC_LABELS[metric.type] || metric.type?.replace(/_/g, ' ')}
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Weight</span>
                    <span className="text-sm font-bold text-teal-600">{metric.weight}%</span>
                  </div>
                  {metric.target && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Target</span>
                      <span className="text-sm font-medium text-gray-900">{formatIndianNumber(metric.target)}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${metric.weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-center font-medium text-gray-900 w-16">Rank</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Name</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Premium</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Policies</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">New Customers</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Renewals</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, idx) => {
                  const rank = entry.rank || idx + 1;
                  return (
                    <tr
                      key={entry.id || idx}
                      className={`border-t border-gray-200 ${
                        rank <= 3 ? 'bg-yellow-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-teal-50 transition-colors`}
                    >
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center gap-1 w-8 h-8 rounded-full border text-sm font-bold ${getRankBadge(rank)}`}>
                          {getRankIcon(rank) || rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{entry.userName || entry.name || '-'}</p>
                        {entry.pospCode && (
                          <p className="text-xs text-gray-500">{entry.pospCode}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-teal-600">
                        {formatCurrency(entry.totalPremium || entry.premium || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {formatIndianNumber(entry.policyCount || entry.policies || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {formatIndianNumber(entry.newCustomers || 0)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">
                        {formatIndianNumber(entry.renewals || 0)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-bold ${
                          rank === 1 ? 'text-yellow-600' :
                          rank === 2 ? 'text-gray-600' :
                          rank === 3 ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          {entry.score?.toFixed(1) || '0.0'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No leaderboard data yet</p>
                    <p className="text-sm mt-1">Click "Calculate Scores" to generate the leaderboard</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contest Description */}
      {contest.description && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
          <p className="text-sm text-gray-600">{contest.description}</p>
        </div>
      )}
    </div>
  );
};

export default ContestDetail;
