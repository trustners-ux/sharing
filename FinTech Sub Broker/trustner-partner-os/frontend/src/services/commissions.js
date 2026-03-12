import api from './api'

export const commissionsAPI = {
  // Slabs
  getSlabs: (params) => api.get('/insurance/commissions/slabs', { params }),
  configureSlabs: (data) => api.post('/insurance/commissions/slabs', data),

  // Commission Calculation
  calculate: (policyId, type) => api.post('/insurance/commissions/calculate', { policyId, type }),
  batchCalculate: (data) => api.post('/insurance/commissions/batch-calculate', data),

  // Reconciliation
  reconcile: (data) => api.post('/insurance/commissions/reconcile', data),
  processClawback: (data) => api.post('/insurance/commissions/clawback', data),

  // Payouts
  generatePayouts: (data) => api.post('/insurance/commissions/payouts/generate', data),
  getPayouts: (params) => api.get('/insurance/commissions/payouts', { params }),
  approvePayout: (id) => api.post(`/insurance/commissions/payouts/${id}/approve`),
  markPaid: (id, data) => api.post(`/insurance/commissions/payouts/${id}/mark-paid`, data),

  // Reports
  getStatement: (params) => api.get('/insurance/commissions/statement', { params }),
  getReceivables: (params) => api.get('/insurance/commissions/receivables', { params }),
  getPayables: (params) => api.get('/insurance/commissions/payables', { params }),

  // Payout Config
  getPayoutConfig: (pospId) => api.get(`/insurance/commissions/payout-config/${pospId}`),
  setPayoutConfig: (data) => api.post('/insurance/commissions/payout-config', data),
  listPayoutConfigs: (params) => api.get('/insurance/commissions/payout-config', { params }),
}

export default commissionsAPI
