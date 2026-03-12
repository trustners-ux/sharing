import api from './api'

export const endorsementsAPI = {
  create: (data) => api.post('/insurance/endorsements', data),
  getAll: (params) => api.get('/insurance/endorsements', { params }),
  getOne: (id) => api.get(`/insurance/endorsements/${id}`),
  update: (id, data) => api.patch(`/insurance/endorsements/${id}`, data),
  updateStatus: (id, data) => api.patch(`/insurance/endorsements/${id}/status`, data),
  getByPolicy: (policyId) => api.get(`/insurance/endorsements/policy/${policyId}`),
}

export default endorsementsAPI
