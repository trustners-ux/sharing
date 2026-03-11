import React, { useState, useEffect, useCallback } from 'react'
import { authService } from '../../services/auth'
import {
  FileText, Search, Filter, Calendar, Loader2, ChevronLeft, ChevronRight,
  LogIn, LogOut, ShieldAlert, User, RefreshCw
} from 'lucide-react'

const ACTION_BADGE_COLORS = {
  LOGIN: 'bg-green-100 text-green-700 border-green-200',
  LOGIN_FAILED: 'bg-red-100 text-red-700 border-red-200',
  LOGOUT: 'bg-slate-100 text-slate-600 border-slate-200',
  CREATE: 'bg-blue-100 text-blue-700 border-blue-200',
  UPDATE: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
  PASSWORD_CHANGE: 'bg-purple-100 text-purple-700 border-purple-200',
  PASSWORD_RESET: 'bg-orange-100 text-orange-700 border-orange-200',
  MIS_CREATE: 'bg-teal-100 text-teal-700 border-teal-200',
  MIS_VERIFY: 'bg-green-100 text-green-700 border-green-200',
  MIS_REJECT: 'bg-red-100 text-red-700 border-red-200',
  USER_CREATED: 'bg-blue-100 text-blue-700 border-blue-200',
  USER_APPROVED: 'bg-green-100 text-green-700 border-green-200',
  USER_DEACTIVATED: 'bg-red-100 text-red-700 border-red-200',
}

const ACTION_LABELS = {
  LOGIN: 'Login',
  LOGIN_FAILED: 'Login Failed',
  LOGOUT: 'Logout',
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  PASSWORD_CHANGE: 'Password Change',
  PASSWORD_RESET: 'Password Reset',
  MIS_CREATE: 'MIS Create',
  MIS_VERIFY: 'MIS Verify',
  MIS_REJECT: 'MIS Reject',
  USER_CREATED: 'User Created',
  USER_APPROVED: 'User Approved',
  USER_DEACTIVATED: 'User Deactivated',
}

const ALL_ACTIONS = Object.keys(ACTION_LABELS)
const LOGIN_ACTIONS = ['LOGIN', 'LOGIN_FAILED', 'LOGOUT']

function ActionBadge({ action }) {
  const colorClass = ACTION_BADGE_COLORS[action] || 'bg-slate-100 text-slate-600 border-slate-200'
  const label = ACTION_LABELS[action] || action
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  )
}

export default function AuditLogsPage() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'login'
  const [logs, setLogs] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const pageSize = 20

  // Filters
  const [actionFilter, setActionFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Unique users for filter dropdown
  const [allUsers, setAllUsers] = useState([])

  const fetchLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = {
        page: String(page),
        limit: String(pageSize),
      }
      if (actionFilter) params.action = actionFilter
      if (userFilter) params.userId = userFilter
      if (dateFrom) params.dateFrom = dateFrom
      if (dateTo) params.dateTo = dateTo

      let result
      if (activeTab === 'login') {
        result = await authService.getLoginLogs(params)
      } else {
        result = await authService.getAuditLogs(params)
      }

      setLogs(result.logs || result.data || [])
      setTotalCount(result.total || result.count || 0)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
      setLogs([])
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [page, activeTab, actionFilter, userFilter, dateFrom, dateTo])

  // Fetch user list for filter dropdown
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const result = await authService.listUsers({ limit: '500' })
        setAllUsers(result.users || result.data || [])
      } catch {
        // Non-critical
      }
    }
    fetchUserList()
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Reset page on filter/tab changes
  useEffect(() => {
    setPage(1)
  }, [activeTab, actionFilter, userFilter, dateFrom, dateTo])

  // Reset action filter when switching tabs
  useEffect(() => {
    setActionFilter('')
  }, [activeTab])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const actionOptions = activeTab === 'login' ? LOGIN_ACTIONS : ALL_ACTIONS

  const clearFilters = () => {
    setActionFilter('')
    setUserFilter('')
    setDateFrom('')
    setDateTo('')
  }

  const hasActiveFilters = actionFilter || userFilter || dateFrom || dateTo

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-teal-600" />
          Audit Logs
        </h1>
        <p className="text-sm text-slate-500 mt-1">Track all system activity, user actions, and login events</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-initial px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 justify-center">
              <FileText className="w-4 h-4" />
              All Logs
            </span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 sm:flex-initial px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'login'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="flex items-center gap-2 justify-center">
              <LogIn className="w-4 h-4" />
              Login Logs
            </span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Date From */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[160px]"
                placeholder="From date"
              />
            </div>

            {/* Date To */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[160px]"
                placeholder="To date"
              />
            </div>

            {/* Action Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none min-w-[180px]"
              >
                <option value="">All Actions</option>
                {actionOptions.map((a) => (
                  <option key={a} value={a}>{ACTION_LABELS[a]}</option>
                ))}
              </select>
            </div>

            {/* User Filter */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white appearance-none min-w-[180px]"
              >
                <option value="">All Users</option>
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            <span className="ml-2 text-sm text-slate-500">Loading logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No audit logs found</p>
            <p className="text-slate-400 text-xs mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Activity will appear here as users interact with the system'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">User</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Action</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Entity</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Details</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600 whitespace-nowrap">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr
                    key={log.id || idx}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                  >
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatTimestamp(log.createdAt || log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-slate-900 font-medium text-xs">
                          {log.user?.name || log.userName || '-'}
                        </p>
                        <p className="text-slate-400 text-xs truncate max-w-[180px]">
                          {log.user?.email || log.userEmail || ''}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {log.entity || log.entityType || '-'}
                      {(log.entityId || log.targetId) && (
                        <span className="text-slate-400 ml-1">#{log.entityId || log.targetId}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[250px] truncate">
                      {typeof log.details === 'object'
                        ? JSON.stringify(log.details)
                        : log.details || log.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                      {log.ipAddress || log.ip || '-'}
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
              Showing {Math.min((page - 1) * pageSize + 1, totalCount)} - {Math.min(page * pageSize, totalCount)} of {totalCount} entries
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
    </div>
  )
}
