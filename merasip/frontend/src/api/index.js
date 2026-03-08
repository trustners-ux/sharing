const BASE = import.meta.env.VITE_API_URL || ''

const getToken = () => localStorage.getItem('advisor_token')

const headers = (auth = false) => ({
  'Content-Type': 'application/json',
  ...(auth ? { Authorization: `Bearer ${getToken()}` } : {})
})

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || err.message || 'Request failed')
  }
  return res.json()
}

// Fetch with timeout + retry for Render cold-starts (free tier spins down)
const fetchWithRetry = async (url, options, { retries = 2, timeout = 120000 } = {}) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timer)
      if ((res.status === 502 || res.status === 503) && attempt < retries) {
        // Server likely cold-starting — wait and retry
        await new Promise(r => setTimeout(r, 3000))
        continue
      }
      return res
    } catch (err) {
      clearTimeout(timer)
      if (err.name === 'AbortError') {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 2000)); continue }
        throw new Error('Request timed out. The server may be starting up — please try again in a minute.')
      }
      if (attempt < retries) { await new Promise(r => setTimeout(r, 2000)); continue }
      throw new Error('Unable to reach server. Please check your connection and try again.')
    }
  }
}

export const api = {
  // === CAS Parser (public) ===
  parseCAS: (file, password) => {
    const form = new FormData()
    form.append('file', file)
    if (password) form.append('password', password)
    return fetchWithRetry(`${BASE}/api/parse-cas`, { method: 'POST', body: form }, { retries: 2, timeout: 120000 }).then(handleResponse)
  },

  // === Reports (advisor auth) ===
  generateReport: (type, data) =>
    fetch(`${BASE}/api/generate-report`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify({ type, data })
    }).then(handleResponse),

  sendEmail: (payload) =>
    fetch(`${BASE}/api/generate-report/email`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  sendWhatsApp: (payload) =>
    fetch(`${BASE}/api/generate-report/whatsapp`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  // === Clients (advisor auth) ===
  getClients: () =>
    fetch(`${BASE}/api/clients`, { headers: headers(true) }).then(handleResponse),

  createClient: (data) =>
    fetch(`${BASE}/api/clients`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getClient: (id) =>
    fetch(`${BASE}/api/clients/${id}`, { headers: headers(true) }).then(handleResponse),

  getPortfolio: (id) =>
    fetch(`${BASE}/api/clients/${id}/portfolio`, { headers: headers(true) }).then(handleResponse),

  savePortfolio: (clientId, data) =>
    fetch(`${BASE}/api/clients/${clientId}/portfolio`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // === Reports list ===
  getReports: (clientId) =>
    fetch(`${BASE}/api/reports/${clientId}`, { headers: headers(true) }).then(handleResponse),

  // === NAV (public) ===
  getNAV: (code) =>
    fetch(`${BASE}/api/nav/${code}`).then(handleResponse),

  searchFunds: (query) =>
    fetch(`${BASE}/api/nav/search/${encodeURIComponent(query)}`).then(handleResponse),

  getNAVHistory: (code, days = 30) =>
    fetch(`${BASE}/api/nav/${code}/history?days=${days}`).then(handleResponse),

  // === Auth ===
  advisorLogin: (email) =>
    fetch(`${BASE}/api/auth/advisor-login`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ email })
    }).then(handleResponse),

  verifyOTP: (email, token) =>
    fetch(`${BASE}/api/auth/verify-otp`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ email, token })
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE}/api/auth/me`, { headers: headers(true) }).then(handleResponse),

  // === Review Workflow ===
  submitForReview: (data) =>
    fetch(`${BASE}/api/review/submit`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  getReviewQueue: (status) =>
    fetch(`${BASE}/api/review/queue${status ? `?status=${status}` : ''}`, {
      headers: headers(true)
    }).then(handleResponse),

  getReviewItem: (id) =>
    fetch(`${BASE}/api/review/queue/${id}`, { headers: headers(true) }).then(handleResponse),

  updateReview: (id, decision) =>
    fetch(`${BASE}/api/review/queue/${id}`, {
      method: 'PATCH', headers: headers(true),
      body: JSON.stringify(decision)
    }).then(handleResponse),

  generateReviewedReport: (id) =>
    fetch(`${BASE}/api/review/queue/${id}/generate`, {
      method: 'POST', headers: headers(true)
    }).then(handleResponse),

  // === Password Auth ===
  loginWithPassword: (email, password) =>
    fetch(`${BASE}/api/auth/login`, {
      method: 'POST', headers: headers(),
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  changePassword: (current_password, new_password) =>
    fetch(`${BASE}/api/auth/change-password`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify({ current_password, new_password })
    }).then(handleResponse),

  // === Employees ===
  getEmployees: () =>
    fetch(`${BASE}/api/employees`, { headers: headers(true) }).then(handleResponse),

  getEmployee: (id) =>
    fetch(`${BASE}/api/employees/${id}`, { headers: headers(true) }).then(handleResponse),

  createEmployee: (data) =>
    fetch(`${BASE}/api/employees`, {
      method: 'POST', headers: headers(true),
      body: JSON.stringify(data)
    }).then(handleResponse),

  updateEmployee: (id, data) =>
    fetch(`${BASE}/api/employees/${id}`, {
      method: 'PATCH', headers: headers(true),
      body: JSON.stringify(data)
    }).then(handleResponse),

  resetEmployeePassword: (id) =>
    fetch(`${BASE}/api/employees/${id}/reset-password`, {
      method: 'POST', headers: headers(true)
    }).then(handleResponse),

  getActivityLog: () =>
    fetch(`${BASE}/api/employees/activity`, { headers: headers(true) }).then(handleResponse),
}
