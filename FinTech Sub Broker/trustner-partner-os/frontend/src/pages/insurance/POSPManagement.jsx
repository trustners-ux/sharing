import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, AlertCircle, Download, ChevronDown, Users, GitBranch, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import pospAPI from '../../services/posp';
import { formatCurrency, formatIndianNumber } from '../../utils/formatters';

// Roles that can see all POSPs (admin view)
const ADMIN_ROLES = ['SUPER_ADMIN', 'PRINCIPAL_OFFICER', 'COMPLIANCE_ADMIN'];
// Roles that can export data
const EXPORT_ROLES = ['SUPER_ADMIN', 'PRINCIPAL_OFFICER', 'COMPLIANCE_ADMIN', 'CLUSTER_DEVELOPMENT_MANAGER'];
// Roles that can register new POSPs
const REGISTER_ROLES = ['SUPER_ADMIN', 'COMPLIANCE_ADMIN', 'RELATIONSHIP_MANAGER'];

const POSPManagement = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const userRole = authUser?.role || '';

  const [posps, setPOSPs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, skip: 0, take: 20, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Individual',
    agentCode: '',
    documents: {},
  });

  const categories = ['Individual', 'Corporate', 'Corporate Group'];

  const isAdmin = ADMIN_ROLES.includes(userRole);
  const canExport = EXPORT_ROLES.includes(userRole);
  const canRegister = REGISTER_ROLES.includes(userRole);
  const isCDM = userRole === 'CLUSTER_DEVELOPMENT_MANAGER';
  const isRM = userRole === 'RELATIONSHIP_MANAGER';

  // Fetch POSPs based on user's role
  const fetchPOSPs = useCallback(async (skip = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip,
        take: pagination.take,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      if (selectedManagerId) params.managerId = selectedManagerId;

      // Use hierarchy-scoped endpoint (handles role routing on backend)
      const res = await pospAPI.getMyPOSPs(params);
      setPOSPs(res.data || []);
      setPagination(res.pagination || { total: 0, skip: 0, take: 20, pages: 0 });
    } catch (err) {
      setError('Failed to load POSP data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, selectedManagerId, pagination.take]);

  // Fetch team hierarchy for CDM users
  const fetchTeamData = useCallback(async () => {
    if (isCDM || isAdmin) {
      try {
        const res = await pospAPI.getMyTeam();
        setTeamData(res);
      } catch (err) {
        console.error('Failed to fetch team data:', err);
      }
    }
  }, [isCDM, isAdmin]);

  useEffect(() => {
    fetchPOSPs();
    fetchTeamData();
  }, []);

  // Re-fetch when filters change (debounced search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPOSPs(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, selectedManagerId]);

  const handleExport = async (format) => {
    try {
      setExportLoading(true);
      await pospAPI.downloadExport(format, {
        status: statusFilter || undefined,
        search: searchQuery || undefined,
      });
    } catch (err) {
      alert('Export failed. Please try again.');
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleRegisterPOSP = async (e) => {
    e.preventDefault();
    try {
      await pospAPI.register(formData);
      setShowModal(false);
      setFormStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Individual',
        agentCode: '',
        documents: {},
      });
      fetchPOSPs(0);
    } catch (err) {
      alert('Failed to register POSP');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      APPLICATION_RECEIVED: 'bg-blue-100 text-blue-800',
      TRAINING_IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      TRAINING_COMPLETED: 'bg-indigo-100 text-indigo-800',
      EXAM_SCHEDULED: 'bg-purple-100 text-purple-800',
      EXAM_PASSED: 'bg-teal-100 text-teal-800',
      EXAM_FAILED: 'bg-red-100 text-red-800',
      CERTIFICATE_ISSUED: 'bg-cyan-100 text-cyan-800',
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-orange-100 text-orange-800',
      TERMINATED: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status) => {
    const labels = {
      APPLICATION_RECEIVED: 'Application Received',
      TRAINING_IN_PROGRESS: 'Training In Progress',
      TRAINING_COMPLETED: 'Training Completed',
      EXAM_SCHEDULED: 'Exam Scheduled',
      EXAM_PASSED: 'Exam Passed',
      EXAM_FAILED: 'Exam Failed',
      CERTIFICATE_ISSUED: 'Certificate Issued',
      ACTIVE: 'Active',
      SUSPENDED: 'Suspended',
      TERMINATED: 'Terminated',
    };
    return labels[status] || status;
  };

  // Get RMs from team data for CDM filter
  const teamRMs = teamData?.team?.filter(m => m.hierarchyLevel?.levelCode === 'RM') || [];

  if (loading && posps.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading POSP data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">POSP Management</h1>
          <p className="text-gray-600 mt-1">
            {isRM ? 'Manage your assigned POSP agents' :
             isCDM ? 'Manage POSPs across your RM team' :
             'Register and manage all insurance agents'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export buttons */}
          {canExport && (
            <div className="relative group">
              <button
                disabled={exportLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {exportLoading ? 'Exporting...' : 'Export'}
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-20">
                <button
                  onClick={() => handleExport('xlsx')}
                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  Download as Excel (.xlsx)
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-b-lg"
                >
                  Download as CSV (.csv)
                </button>
              </div>
            </div>
          )}
          {/* Register button */}
          {canRegister && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Register POSP
            </button>
          )}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              <p className="text-xs text-gray-500">Total POSPs</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {posps.filter(p => p.status === 'ACTIVE').length}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {posps.filter(p => ['APPLICATION_RECEIVED', 'TRAINING_IN_PROGRESS'].includes(p.status)).length}
              </p>
              <p className="text-xs text-gray-500">In Pipeline</p>
            </div>
          </div>
        </div>
        {(isCDM || isAdmin) && teamRMs.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GitBranch className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{teamRMs.length}</p>
                <p className="text-xs text-gray-500">RMs in Team</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, code, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="APPLICATION_RECEIVED">Application Received</option>
            <option value="TRAINING_IN_PROGRESS">Training In Progress</option>
            <option value="TRAINING_COMPLETED">Training Completed</option>
            <option value="EXAM_SCHEDULED">Exam Scheduled</option>
            <option value="EXAM_PASSED">Exam Passed</option>
            <option value="CERTIFICATE_ISSUED">Certificate Issued</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="TERMINATED">Terminated</option>
          </select>

          {/* RM filter (for CDM view) */}
          {(isCDM || isAdmin) && teamRMs.length > 0 && (
            <select
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-w-[180px]"
            >
              <option value="">All RMs</option>
              {teamRMs.map((rm) => (
                <option key={rm.userId} value={rm.userId}>
                  {rm.user?.profile
                    ? `${rm.user.profile.firstName} ${rm.user.profile.lastName}`
                    : rm.user?.email || rm.userId}
                </option>
              ))}
            </select>
          )}

          {/* Refresh */}
          <button
            onClick={() => fetchPOSPs(0)}
            className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Code</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Category</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Policies</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Premium</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Commission</th>
                <th className="px-6 py-3 text-right font-medium text-gray-900">Renewal Rate</th>
                <th className="px-6 py-3 text-center font-medium text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {posps.length > 0 ? (
                posps.map((posp, idx) => (
                  <tr
                    key={posp.id}
                    className={`border-t border-gray-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors cursor-pointer`}
                    onClick={() => navigate(`/insurance/posp/${posp.id}`)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{posp.agentCode}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {posp.firstName} {posp.lastName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{posp.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(posp.status)}`}>
                        {formatStatus(posp.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                      {formatIndianNumber(posp.totalPoliciesSold || 0)}
                    </td>
                    <td className="px-6 py-4 text-right text-teal-600 font-bold">
                      {formatCurrency(Number(posp.totalPremiumGenerated || 0))}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                      {formatCurrency(Number(posp.totalCommissionEarned || 0))}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 font-medium">
                      {Number(posp.renewalRate || 0).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/insurance/posp/${posp.id}`);
                        }}
                        className="text-teal-600 hover:text-teal-700 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                    {searchQuery || statusFilter
                      ? 'No POSPs match your filters'
                      : isRM
                        ? 'No POSPs assigned to you yet'
                        : 'No POSPs found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {pagination.skip + 1} to {Math.min(pagination.skip + pagination.take, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchPOSPs(Math.max(0, pagination.skip - pagination.take))}
                disabled={pagination.skip === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => fetchPOSPs(pagination.skip + pagination.take)}
                disabled={pagination.skip + pagination.take >= pagination.total}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900">Register New POSP</h2>
              <p className="text-sm text-gray-600 mt-1">Step {formStep} of 3</p>
            </div>

            <form onSubmit={handleRegisterPOSP} className="p-6 space-y-4">
              {/* Step 1: Personal Details */}
              {formStep === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Step 2: Documents */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 font-medium">Required Documents:</p>
                  <div className="space-y-2">
                    {['IRDAI License', 'PAN Card', 'Aadhar Card', 'Bank Details'].map((doc) => (
                      <label key={doc} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-teal-600 rounded"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              documents: {
                                ...formData.documents,
                                [doc]: e.target.checked,
                              },
                            })
                          }
                        />
                        <span className="text-sm text-gray-700">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="text-sm text-teal-900 font-medium mb-3">Review Information:</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Category:</strong> {formData.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    By clicking Register, you confirm that all information is accurate and you agree to the terms and conditions.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (formStep === 1) {
                      setShowModal(false);
                      setFormStep(1);
                    } else {
                      setFormStep(formStep - 1);
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  {formStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                  type={formStep === 3 ? 'submit' : 'button'}
                  onClick={() => {
                    if (formStep < 3) setFormStep(formStep + 1);
                  }}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  {formStep === 3 ? 'Register' : 'Next'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSPManagement;
