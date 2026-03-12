import api from './api'

export const policiesAPI = {
  create: (data) => api.post('/insurance/policies', data),
  getAll: (params) => api.get('/insurance/policies', { params }),
  getOne: (id) => api.get(`/insurance/policies/${id}`),
  update: (id, data) => api.patch(`/insurance/policies/${id}`, data),
  updateStatus: (id, data) => api.patch(`/insurance/policies/${id}/status`, data),
}

export default policiesAPI
