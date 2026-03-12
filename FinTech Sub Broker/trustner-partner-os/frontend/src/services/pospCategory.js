import api from './api';

const BASE = '/insurance/posp-category';

// --- Dashboard ---
export const getDashboard = () => api.get(`${BASE}/dashboard`);

// --- Category Assignments ---
export const listAssignments = (params) => api.get(`${BASE}/assignments`, { params });
export const assignCategory = (data) => api.post(`${BASE}/assignments`, data);
export const bulkAssignDefaults = () => api.post(`${BASE}/assignments/bulk-defaults`);
export const getPospCategories = (pospId) => api.get(`${BASE}/posp/${pospId}/categories`);
export const getCategoryHistory = (pospId, lob) => api.get(`${BASE}/posp/${pospId}/history`, { params: { lob } });
export const updateCategory = (pospId, lob, data) => api.patch(`${BASE}/posp/${pospId}/${lob}`, data);

// --- Tier Sharing ---
export const getTierSharing = () => api.get(`${BASE}/tier-sharing`);
export const upsertTierSharing = (data) => api.post(`${BASE}/tier-sharing`, data);
export const updateTierSharing = (id, data) => api.patch(`${BASE}/tier-sharing/${id}`, data);

// --- Product Catalog ---
export const getProducts = (params) => api.get(`${BASE}/products`, { params });
export const getProductStats = () => api.get(`${BASE}/products/stats`);
export const getFilterOptions = () => api.get(`${BASE}/products/filters`);
export const getProduct = (id) => api.get(`${BASE}/products/${id}`);
export const createProduct = (data) => api.post(`${BASE}/products`, data);
export const updateProduct = (id, data) => api.patch(`${BASE}/products/${id}`, data);

// --- Payouts ---
export const calculatePayout = (data) => api.post(`${BASE}/payouts/calculate`, data);
export const quickCalculate = (data) => api.post(`${BASE}/payouts/quick-calc`, data);
export const getPayoutRecords = (params) => api.get(`${BASE}/payouts`, { params });
export const getPospPayoutSummary = (pospId) => api.get(`${BASE}/payouts/posp/${pospId}`);
export const approvePayout = (id) => api.patch(`${BASE}/payouts/${id}/approve`);
export const markPayoutPaid = (id, bankRefNumber) => api.patch(`${BASE}/payouts/${id}/paid`, { bankRefNumber });

// --- Seed ---
export const seedTierSharing = () => api.post(`${BASE}/seed/tier-sharing`);
export const seedProducts = (products) => api.post(`${BASE}/seed/products`, { products });

export default {
  getDashboard,
  listAssignments,
  assignCategory,
  bulkAssignDefaults,
  getPospCategories,
  getCategoryHistory,
  updateCategory,
  getTierSharing,
  upsertTierSharing,
  updateTierSharing,
  getProducts,
  getProductStats,
  getFilterOptions,
  getProduct,
  createProduct,
  updateProduct,
  calculatePayout,
  quickCalculate,
  getPayoutRecords,
  getPospPayoutSummary,
  approvePayout,
  markPayoutPaid,
  seedTierSharing,
  seedProducts,
};
