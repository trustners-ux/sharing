import React, { useState, useEffect, useCallback } from 'react'
import { authService } from '../../services/auth'
import {
  Users, Plus, Search, Filter, X, Eye, EyeOff, RotateCcw, ShieldCheck,
  Copy, Check, AlertCircle, Loader2, ChevronLeft, ChevronRight, UserCog, Mail, Phone
} from 'lucide-react'

const ALL_ROLES = [
  'SUPER_ADMIN',
  'COMPLIANCE_ADMIN',
  'FINANCE_ADMIN',
  'PRINCIPAL_OFFICER',
  'MIS_MANAGER',
  'MIS_CHECKER',
  'MIS_ENTRY_OPERATOR',
  'REGIONAL_HEAD',
  'SUB_BROKER',
  'POSP',
  'CLIENT',
]

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  COMPLIANCE_ADMIN: 'Compliance Admin',
  FINANCE_ADMIN: 'Finance Admin',
  PRINCIPAL_OFFICER: 'Principal Officer',
  MIS_MANAGER: 'MIS Manager',
  MIS_CHECKER: 'MIS Checker',
  MIS_ENTRY_OPERATOR: 'MIS Entry Operator',
  REGIONAL_HEAD: 'Regional Head',
  SUB_BROKER: 'Sub-Broker',
  POSP: 'POSP Agent',
  CLIENT: 'Client',
}

const ROLE_BADGE_COLORS = {
  SUPER_ADMIN: 'bg-red-100 text-red-700 border-red-200',
  COMPLIANCE_ADMIN: 'bg-orange-100 text-orange-700 border-orange-200',
  FINANCE_ADMIN: 'bg-green-100 text-green-700 border-green-200',
  PRINCIPAL_OFFICER: 'bg-purple-100 text-purple-700 border-purple-200',
  MIS_MANAGER: 'bg-blue-100 text-blue-700 border-blue-200',
  MIS_CHECKER: 'bg-teal-100 text-teal-700 border-teal-200',
  MIS_ENTRY_OPERATOR: 'bg-green-100 text-green-700 border-green-200',
  REGIONAL_HEAD: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  SUB_BROKER: 'bg-violet-100 text-violet-700 border-violet-200',
  POSP: 'bg-orange-100 text-orange-700 border-orange-200',
  CLIENT: 'bg-slate-100 text-slate-700 border-slate-200',
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ROLE_BADGE_COLORS[role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {ROLE_LABELS[role] || role}
    </span>
  )
}

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
      Inactive
    </span>
  )
}

// --- Modal Components ---

function CreateUserModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('MIS_ENTRY_OPERATOR')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await authService.createUser({ name, email, phone: phone || undefined, role })
      onCreated(result)
      setName('')
      setEmail('')
      setPhone('')
      setRole('MIS_ENTRY_OPERATOR')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Add New User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@trustner.com"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TempPasswordModal({ isOpen, onClose, tempPassword, userName }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = tempPassword
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Temporary Password</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Important</p>
                <p className="text-xs text-amber-700 mt-1">
                  Please send this temporary password to {userName || 'the user'} via email or secure channel.
                  They will be required to change it on first login.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
            <code className="text-lg font-mono font-semibold text-slate-900 tracking-wider">
              {tempPassword}
            </code>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

function ChangeRoleModal({ isOpen, onClose, user: targetUser, onRoleChanged }) {
  const [newRole, setNewRole] = useState(targetUser?.role || 'MIS_ENTRY_OPERATOR')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (targetUser) setNewRole(targetUser.role)
  }, [targetUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await authService.updateUserRole(targetUser.id, newRole)
      onRoleChanged({ ...targetUser, role: newRole })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !targetUser) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Change Role</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-slate-600 mb-3">
              Changing role for <span className="font-semibold text-slate-900">{targetUser.name}</span>
            </p>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || newRole === targetUser.role}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- Main Page ---

export default function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 15

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showTempPasswordModal, setShowTempPasswordModal] = useState(false)
  const [tempPassword, setTempPassword] = useState('')
  const [tempPasswordUserName, setTempPasswordUserName] = useState('')
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Loading states for inline actions
  const [actionLoadingId, setActionLoadingId] = useState(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: String(page),
        limit: String(pageSize),
      }
      if (searchQuery) params.search = searchQuery
      if (roleFilter) params.role = roleFilter

      const result = await authService.listUsers(params)
      setUsers(result.users || result.data || [])
      setTotalCount(result.total || result.count || 0)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [page, searchQuery, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1)
  }, [searchQuery, roleFilter])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleUserCreated = (result) => {
    setShowCreateModal(false)
    setTempPassword(result.temporaryPassword || result.tempPassword || 'Generated')
    setTempPasswordUserName(result.user?.name || result.name || '')
    setShowTempPasswordModal(true)
    fetchUsers()
  }

  const handleToggleActive = async (user) => {
    setActionLoadingId(user.id)
    try {
      await authService.toggleUserActive(user.id)
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      )
    } catch (err) {
      console.error('Failed to toggle user active status:', err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleResetPassword = async (user) => {
    setActionLoadingId(user.id)
    try {
      const result = await authService.resetUserPassword(user.id)
      setTempPassword(result.temporaryPassword || result.tempPassword || 'Generated')
      setTempPasswordUserName(user.name)
      setShowTempPasswordModal(true)
    } catch (err) {
      console.error('Failed to reset password:', err)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleChangeRole = (user) => {
    setSelectedUser(user)
    setShowChangeRoleModal(true)
  }

  const handleRoleChanged = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, role: updatedUser.role } : u))
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-600" />
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage user accounts, roles, and access control</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none min-w-[180px]"
            >
              <option value="">All Roles</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            <span className="ml-2 text-sm text-slate-500">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No users found</p>
            <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Last Login</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-semibold shrink-0">
                          {(u.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 truncate">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3"><StatusBadge isActive={u.isActive !== false} /></td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(u.lastLoginAt || u.lastLogin)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {actionLoadingId === u.id ? (
                          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleResetPassword(u)}
                              title="Reset Password"
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleActive(u)}
                              title={u.isActive !== false ? 'Deactivate' : 'Activate'}
                              className={`p-1.5 rounded-lg transition-colors ${
                                u.isActive !== false
                                  ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                  : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {u.isActive !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleChangeRole(u)}
                              title="Change Role"
                              className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              <UserCog className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {Math.min((page - 1) * pageSize + 1, totalCount)} - {Math.min(page * pageSize, totalCount)} of {totalCount} users
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs text-slate-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleUserCreated}
      />
      <TempPasswordModal
        isOpen={showTempPasswordModal}
        onClose={() => setShowTempPasswordModal(false)}
        tempPassword={tempPassword}
        userName={tempPasswordUserName}
      />
      <ChangeRoleModal
        isOpen={showChangeRoleModal}
        onClose={() => setShowChangeRoleModal(false)}
        user={selectedUser}
        onRoleChanged={handleRoleChanged}
      />
    </div>
  )
}
