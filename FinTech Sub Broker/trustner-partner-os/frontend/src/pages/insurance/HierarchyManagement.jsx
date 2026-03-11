import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Users,
  Building2,
  MapPin,
  X,
  Save,
  Layers,
  User,
} from 'lucide-react';
import misAPI from '../../services/mis';

const DEPARTMENTS = ['Health', 'Life', 'General', 'Motor', 'Travel'];
const REGIONS = ['North', 'South', 'East', 'West', 'Central', 'Pan India'];

const HierarchyManagement = () => {
  const [levels, setLevels] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Level form state
  const [showLevelForm, setShowLevelForm] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [levelForm, setLevelForm] = useState({ name: '', rank: '', description: '' });

  // Node form state
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [nodeForm, setNodeForm] = useState({
    userName: '',
    userId: '',
    levelId: '',
    department: '',
    region: '',
    parentId: '',
  });
  const [savingLevel, setSavingLevel] = useState(false);
  const [savingNode, setSavingNode] = useState(false);

  // Tree expand state
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [levelsRes, treeRes] = await Promise.all([
        misAPI.getHierarchyLevels(),
        misAPI.getHierarchyTree(),
      ]);
      setLevels(levelsRes.data || []);
      setTree(treeRes.data || []);
    } catch (err) {
      setError('Failed to load hierarchy data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelFormChange = (field, value) => {
    setLevelForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLevel = async () => {
    try {
      setSavingLevel(true);
      setError(null);
      const payload = {
        ...levelForm,
        rank: parseInt(levelForm.rank, 10),
      };
      if (editingLevel) {
        await misAPI.updateLevel(editingLevel.id, payload);
      } else {
        await misAPI.createLevel(payload);
      }
      setShowLevelForm(false);
      setEditingLevel(null);
      setLevelForm({ name: '', rank: '', description: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save level');
      console.error(err);
    } finally {
      setSavingLevel(false);
    }
  };

  const handleEditLevel = (level) => {
    setEditingLevel(level);
    setLevelForm({
      name: level.name,
      rank: level.rank?.toString() || '',
      description: level.description || '',
    });
    setShowLevelForm(true);
  };

  const handleNodeFormChange = (field, value) => {
    setNodeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveNode = async () => {
    try {
      setSavingNode(true);
      setError(null);
      await misAPI.createNode(nodeForm);
      setShowNodeModal(false);
      setNodeForm({ userName: '', userId: '', levelId: '', department: '', region: '', parentId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add node');
      console.error(err);
    } finally {
      setSavingNode(false);
    }
  };

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderTreeNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer`}
          style={{ paddingLeft: `${depth * 24 + 16}px` }}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}

          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-teal-700" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {node.userName || node.name || 'Unnamed'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {node.levelName && (
                <span className="text-xs text-teal-600 font-medium">{node.levelName}</span>
              )}
              {node.department && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {node.department}
                </span>
              )}
              {node.region && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {node.region}
                </span>
              )}
            </div>
          </div>

          {hasChildren && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {node.children.length}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading hierarchy...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hierarchy Management</h1>
        <p className="text-gray-600 mt-2">Manage organization levels and structure</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Hierarchy Levels */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Hierarchy Levels</h2>
              </div>
              <button
                onClick={() => {
                  setEditingLevel(null);
                  setLevelForm({ name: '', rank: '', description: '' });
                  setShowLevelForm(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Level
              </button>
            </div>

            {/* Level Form */}
            {showLevelForm && (
              <div className="bg-teal-50 rounded-lg p-4 mb-4 border border-teal-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3">
                  {editingLevel ? 'Edit Level' : 'Add New Level'}
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Level Name (e.g., Regional Head)"
                    value={levelForm.name}
                    onChange={(e) => handleLevelFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="number"
                    placeholder="Rank (1 = highest)"
                    value={levelForm.rank}
                    onChange={(e) => handleLevelFormChange('rank', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="1"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={levelForm.description}
                    onChange={(e) => handleLevelFormChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowLevelForm(false); setEditingLevel(null); }}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveLevel}
                      disabled={savingLevel || !levelForm.name || !levelForm.rank}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingLevel ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Levels List */}
            <div className="space-y-2">
              {levels.length > 0 ? (
                levels
                  .sort((a, b) => (a.rank || 0) - (b.rank || 0))
                  .map((level) => (
                    <div
                      key={level.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                          {level.rank}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{level.name}</p>
                          {level.description && (
                            <p className="text-xs text-gray-500">{level.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditLevel(level)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No levels defined yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Organization Tree */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-900">Organization Tree</h2>
              </div>
              <button
                onClick={() => setShowNodeModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Node
              </button>
            </div>

            {tree.length > 0 ? (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                {tree.map((node) => renderTreeNode(node))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No organization structure yet</p>
                <p className="text-sm mt-1">Add levels and nodes to build your hierarchy</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Node Modal */}
      {showNodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900">Add Organization Node</h2>
              <button onClick={() => setShowNodeModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Name *</label>
                <input
                  type="text"
                  value={nodeForm.userName}
                  onChange={(e) => handleNodeFormChange('userName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  type="text"
                  value={nodeForm.userId}
                  onChange={(e) => handleNodeFormChange('userId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <select
                  value={nodeForm.levelId}
                  onChange={(e) => handleNodeFormChange('levelId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select Level</option>
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={nodeForm.department}
                  onChange={(e) => handleNodeFormChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  value={nodeForm.region}
                  onChange={(e) => handleNodeFormChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Region</option>
                  {REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Node ID</label>
                <input
                  type="text"
                  value={nodeForm.parentId}
                  onChange={(e) => handleNodeFormChange('parentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Leave empty for root node"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNodeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNode}
                  disabled={savingNode || !nodeForm.userName || !nodeForm.levelId}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {savingNode ? 'Adding...' : 'Add Node'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchyManagement;
