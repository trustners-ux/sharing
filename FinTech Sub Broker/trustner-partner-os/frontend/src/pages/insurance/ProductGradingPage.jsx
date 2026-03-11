import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Edit,
  X,
  Save,
  Zap,
  Award,
  Package,
  BarChart3,
} from 'lucide-react';
import misAPI from '../../services/mis';

const GRADE_COLORS = {
  A: 'bg-green-100 text-green-800 border-green-200',
  B: 'bg-blue-100 text-blue-800 border-blue-200',
  C: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  D: 'bg-red-100 text-red-800 border-red-200',
};

const GRADE_BG = {
  A: 'bg-green-600',
  B: 'bg-blue-600',
  C: 'bg-yellow-500',
  D: 'bg-red-600',
};

const LOB_OPTIONS = [
  'MOTOR_TWO_WHEELER', 'MOTOR_FOUR_WHEELER', 'MOTOR_COMMERCIAL',
  'HEALTH_INDIVIDUAL', 'HEALTH_FAMILY_FLOATER', 'HEALTH_GROUP',
  'HEALTH_CRITICAL_ILLNESS', 'HEALTH_TOP_UP',
  'LIFE_TERM', 'LIFE_ENDOWMENT', 'LIFE_ULIP', 'LIFE_WHOLE_LIFE',
  'TRAVEL', 'HOME', 'FIRE', 'MARINE', 'LIABILITY', 'PA_PERSONAL_ACCIDENT', 'CYBER',
];

const COMMISSION_TIERS = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
const COMPLEXITY_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

const ProductGradingPage = () => {
  const [grades, setGrades] = useState([]);
  const [distribution, setDistribution] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoGrading, setAutoGrading] = useState(false);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [editForm, setEditForm] = useState({
    grade: '',
    commissionTier: '',
    complexity: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gradesRes, distRes] = await Promise.all([
        misAPI.getGrades(),
        misAPI.getGradeDistribution(),
      ]);
      setGrades(gradesRes.data?.data || gradesRes.data || []);
      const dist = distRes.data || {};
      setDistribution({
        A: dist.A || dist.a || 0,
        B: dist.B || dist.b || 0,
        C: dist.C || dist.c || 0,
        D: dist.D || dist.d || 0,
      });
    } catch (err) {
      setError('Failed to load product grades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoGrade = async () => {
    try {
      setAutoGrading(true);
      setError(null);
      await misAPI.autoGrade();
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Auto-grading failed');
      console.error(err);
    } finally {
      setAutoGrading(false);
    }
  };

  const handleOpenEdit = (grade) => {
    setEditingGrade(grade);
    setEditForm({
      grade: grade.grade || '',
      commissionTier: grade.commissionTier || '',
      complexity: grade.complexity || '',
    });
    setShowEditModal(true);
  };

  const handleSaveGrade = async () => {
    if (!editingGrade) return;
    try {
      setSaving(true);
      setError(null);
      await misAPI.updateGrade(editingGrade.id, editForm);
      setShowEditModal(false);
      setEditingGrade(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update grade');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const totalProducts = distribution.A + distribution.B + distribution.C + distribution.D;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product grades...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Product Grading</h1>
          <p className="text-gray-600 mt-2">Grade insurance products for performance tracking</p>
        </div>
        <button
          onClick={handleAutoGrade}
          disabled={autoGrading}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {autoGrading ? 'Auto-Grading...' : 'Auto-Grade All'}
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

      {/* Distribution Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { grade: 'A', label: 'Grade A', desc: 'Excellent', color: 'green' },
          { grade: 'B', label: 'Grade B', desc: 'Good', color: 'blue' },
          { grade: 'C', label: 'Grade C', desc: 'Average', color: 'yellow' },
          { grade: 'D', label: 'Grade D', desc: 'Below Average', color: 'red' },
        ].map(({ grade, label, desc, color }) => (
          <div key={grade} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className={`text-3xl font-bold mt-2 text-${color}-600`}>{distribution[grade]}</p>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
              <div className={`p-3 rounded-lg ${GRADE_BG[grade]}`}>
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            {totalProducts > 0 && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-${color}-500`}
                    style={{ width: `${(distribution[grade] / totalProducts) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {totalProducts > 0 ? ((distribution[grade] / totalProducts) * 100).toFixed(1) : 0}%
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">All Products</h2>
            <span className="text-sm text-gray-500 ml-2">({grades.length} products)</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Product Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Company</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">LOB</th>
                <th className="px-6 py-3 text-center font-medium text-gray-900">Grade</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Commission Tier</th>
                <th className="px-6 py-3 text-left font-medium text-gray-900">Complexity</th>
                <th className="px-6 py-3 text-center font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.length > 0 ? (
                grades.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`border-t border-gray-200 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-teal-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{product.productName || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{product.companyName || product.insurerName || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {product.lob?.replace(/_/g, ' ') || '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.grade ? (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${GRADE_COLORS[product.grade] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {product.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Ungraded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.commissionTier || '-'}</td>
                    <td className="px-6 py-4">
                      {product.complexity && (
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          product.complexity === 'Low' ? 'bg-green-50 text-green-700' :
                          product.complexity === 'Medium' ? 'bg-blue-50 text-blue-700' :
                          product.complexity === 'High' ? 'bg-orange-50 text-orange-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {product.complexity}
                        </span>
                      )}
                      {!product.complexity && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleOpenEdit(product)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-medium text-xs transition-colors mx-auto"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm mt-1">Products will appear here once MIS entries are processed</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Grade Modal */}
      {showEditModal && editingGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Edit Product Grade</h2>
                <p className="text-sm text-gray-600 mt-1">{editingGrade.productName}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select
                  value={editForm.grade}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, grade: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Grade</option>
                  <option value="A">A - Excellent</option>
                  <option value="B">B - Good</option>
                  <option value="C">C - Average</option>
                  <option value="D">D - Below Average</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Tier</label>
                <select
                  value={editForm.commissionTier}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, commissionTier: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Tier</option>
                  {COMMISSION_TIERS.map((tier) => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                <select
                  value={editForm.complexity}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, complexity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Complexity</option>
                  {COMPLEXITY_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Grade Preview */}
              {editForm.grade && (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${GRADE_COLORS[editForm.grade]}`}>
                    Grade {editForm.grade}
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGrade}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGradingPage;
