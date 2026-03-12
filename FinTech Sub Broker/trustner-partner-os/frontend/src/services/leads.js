import api from './api'

export const leadsAPI = {
  // Leads CRUD
  create: (data) => api.post('/insurance/leads', data),
  getAll: (params) => api.get('/insurance/leads', { params }),
  getOne: (id) => api.get(`/insurance/leads/${id}`),
  update: (id, data) => api.patch(`/insurance/leads/${id}`, data),
  updateStatus: (id, data) => api.patch(`/insurance/leads/${id}/status`, data),
  assign: (id, data) => api.post(`/insurance/leads/${id}/assign`, data),

  // Activities
  addActivity: (id, data) => api.post(`/insurance/leads/${id}/activity`, data),

  // Quotes
  getQuotes: (leadId) => api.get(`/insurance/leads/${leadId}`).then(r => r.quotes || []),
  addQuote: (leadId, data) => api.post(`/insurance/leads/${leadId}/quotes`, data),
  selectQuote: (leadId, quoteId) => api.post(`/insurance/leads/${leadId}/quotes/${quoteId}/select`),

  // Conversion
  convertToPolicy: (leadId) => api.post(`/insurance/leads/${leadId}/convert-to-policy`),

  // Analytics
  getAnalytics: (params) => api.get('/insurance/leads/analytics', { params }),
  getFollowUps: (pospId, params) => api.get(`/insurance/leads/${pospId}/follow-ups`, { params }),
}

export default leadsAPI
