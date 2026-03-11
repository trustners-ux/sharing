import api from './api'

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user } = response

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))

    return { accessToken, user }
  },

  logout: () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.post('/auth/logout').catch(() => {}) // Best effort
    }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await api.post('/auth/refresh', { refreshToken })
      const { accessToken } = response

      localStorage.setItem('accessToken', accessToken)
      return accessToken
    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      throw error
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    return api.post('/auth/change-password', { oldPassword, newPassword })
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user')
      return user && user !== 'undefined' ? JSON.parse(user) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  },

  getMe: async () => {
    return api.get('/auth/me')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken')
  },

  getUserRole: () => {
    const user = authService.getCurrentUser()
    return user?.role || null
  },

  // Admin: User Management
  createUser: async (data) => {
    return api.post('/auth/users', data)
  },

  listUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return api.get(`/auth/users${query ? '?' + query : ''}`)
  },

  getUser: async (id) => {
    return api.get(`/auth/users/${id}`)
  },

  toggleUserActive: async (id) => {
    return api.post(`/auth/users/${id}/toggle-active`)
  },

  resetUserPassword: async (id) => {
    return api.post(`/auth/users/${id}/reset-password`)
  },

  updateUserRole: async (id, role) => {
    return api.post(`/auth/users/${id}/update-role`, { role })
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return api.get(`/auth/audit-logs${query ? '?' + query : ''}`)
  },

  getLoginLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return api.get(`/auth/login-logs${query ? '?' + query : ''}`)
  },
}
