// admin.api.js
//
// Consolidated admin API service. All methods hit the authenticated
// `/api/admin/*` endpoints. This single module replaces the ad-hoc method
// definitions that previously lived inline, and adds the website /
// website-content / website-product methods used by the Websites admin
// pages (which were previously missing from lib/api.js).
//
// Uses the centralized `request` helper from ./apiClient.js.

import { request, toQuery } from './apiClient';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const adminApi = {
  // ─── Admin Auth ────────────────────────────────────────────────────
  login: (payload) => request('/api/admin/auth/login', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/admin/auth/forgot-password', { method: 'POST', body: payload }),
  resetPassword: (payload) => request('/api/admin/auth/reset-password', { method: 'POST', body: payload }),
  changePassword: (token, payload) => request('/api/admin/auth/change-password', { method: 'POST', token, isAdmin: true, body: payload }),

  // ─── Admin Products ────────────────────────────────────────────────
  listProducts: (token, params) => request(`/api/admin/products${toQuery(params)}`, { token, isAdmin: true }),
  getProduct: (token, id) => request(`/api/admin/products/${encodeURIComponent(id)}`, { token, isAdmin: true }),
  createProduct: (token, payload) => request('/api/admin/products', { method: 'POST', token, isAdmin: true, body: payload }),
  updateProduct: (token, id, payload) => request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteProduct: (token, id) => request(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE', token, isAdmin: true }),
  reserveProductId: (token) => request('/api/admin/products/reserve-id', { method: 'POST', token, isAdmin: true }),

  // ─── Admin Categories ──────────────────────────────────────────────
  listCategories: (token, params) => request(`/api/admin/categories${toQuery(params)}`, { token, isAdmin: true }),
  getCategoryTree: (token) => request('/api/admin/categories/tree', { token, isAdmin: true }),
  getCategory: (token, id) => request(`/api/admin/categories/${encodeURIComponent(id)}`, { token, isAdmin: true }),
  getCategoryChildren: (token, id) => request(`/api/admin/categories/${encodeURIComponent(id)}/children`, { token, isAdmin: true }),
  createCategory: (token, payload) => request('/api/admin/categories', { method: 'POST', token, isAdmin: true, body: payload }),
  updateCategory: (token, id, payload) => request(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteCategory: (token, id) => request(`/api/admin/categories/${encodeURIComponent(id)}`, { method: 'DELETE', token, isAdmin: true }),

  // ─── Admin Collections ─────────────────────────────────────────────
  listCollections: (token, params) => request(`/api/admin/collections${toQuery(params)}`, { token, isAdmin: true }),
  getCollection: (token, id) => request(`/api/admin/collections/${encodeURIComponent(id)}`, { token, isAdmin: true }),
  createCollection: (token, payload) => request('/api/admin/collections', { method: 'POST', token, isAdmin: true, body: payload }),
  updateCollection: (token, id, payload) => request(`/api/admin/collections/${encodeURIComponent(id)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteCollection: (token, id) => request(`/api/admin/collections/${encodeURIComponent(id)}`, { method: 'DELETE', token, isAdmin: true }),
  addProductsToCollection: (token, id, payload) => request(`/api/admin/collections/${encodeURIComponent(id)}/products`, { method: 'POST', token, isAdmin: true, body: payload }),
  removeProductsFromCollection: (token, id, payload) => request(`/api/admin/collections/${encodeURIComponent(id)}/products`, { method: 'DELETE', token, isAdmin: true, body: payload }),

  // ─── Admin Orders ──────────────────────────────────────────────────
  listOrders: (token, params) => request(`/api/admin/orders${toQuery(params)}`, { token, isAdmin: true }),
  getOrder: (token, id) => request(`/api/admin/orders/${encodeURIComponent(id)}`, { token, isAdmin: true }),
  updateOrder: (token, id, payload) => request(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'PATCH', token, isAdmin: true, body: payload }),
  deleteOrder: (token, id) => request(`/api/admin/orders/${encodeURIComponent(id)}`, { method: 'DELETE', token, isAdmin: true }),

  // ─── Admin Customers ───────────────────────────────────────────────
  listCustomers: (token, params) => request(`/api/admin/customers${toQuery(params)}`, { token, isAdmin: true }),

  // ─── Admin Dashboard ───────────────────────────────────────────────
  getDashboard: (token) => request('/api/admin/dashboard', { token, isAdmin: true }),

  // ─── Admin Image Upload ────────────────────────────────────────────
  uploadImages: (token, formData, productId) => {
    return fetch(`${API_BASE_URL}/api/admin/upload/${productId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Upload failed');
      return data;
    });
  },
  deleteImage: (token, filename) => request('/api/admin/upload', { method: 'DELETE', token, isAdmin: true, body: { filename } }),

  // ─── Admin Shipping / Courier / RTO ────────────────────────────────
  listCouriers: (token) => request('/api/admin/shipping/couriers', { token, isAdmin: true }),
  assignCourier: (token, orderId, payload) => request(`/api/admin/shipping/${orderId}/assign`, { method: 'POST', token, isAdmin: true, body: payload }),
  manageRTO: (token, orderId, payload) => request(`/api/admin/shipping/${orderId}/rto`, { method: 'POST', token, isAdmin: true, body: payload }),
  cancelRTO: (token, orderId) => request(`/api/admin/shipping/${orderId}/cancel-rto`, { method: 'POST', token, isAdmin: true }),
  shiprocketPush: (token, orderId) => request(`/api/admin/shipping/${orderId}/shiprocket/push`, { method: 'POST', token, isAdmin: true }),
  shiprocketTrack: (token, orderId) => request(`/api/admin/shipping/${orderId}/shiprocket/track`, { token, isAdmin: true }),
  generateLabel: (token, orderId) => {
    const url = `${API_BASE_URL}/api/admin/shipping/${orderId}/label`;
    window.open(url + '?token=' + token, '_blank');
    return Promise.resolve({ ok: true });
  },

  // ══════════════════════════════════════════════════════════════════
  // WEBSITES (multi-tenant) — previously MISSING from lib/api.js
  // ══════════════════════════════════════════════════════════════════

  // ─── Website CRUD ─────────────────────────────────────────────────
  listWebsites: (token, params) => request(`/api/admin/websites${toQuery(params)}`, { token, isAdmin: true }),
  getWebsite: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}`, { token, isAdmin: true }),
  createWebsite: (token, payload) => request('/api/admin/websites', { method: 'POST', token, isAdmin: true, body: payload }),
  updateWebsite: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteWebsite: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}`, { method: 'DELETE', token, isAdmin: true }),
  activateWebsite: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/activate`, { method: 'POST', token, isAdmin: true }),
  deactivateWebsite: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/deactivate`, { method: 'POST', token, isAdmin: true }),

  // ─── Website Domains ──────────────────────────────────────────────
  listWebsiteDomains: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/domains`, { token, isAdmin: true }),
  addWebsiteDomain: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/domains`, { method: 'POST', token, isAdmin: true, body: payload }),
  removeWebsiteDomain: (token, id, domainId) => request(`/api/admin/websites/${encodeURIComponent(id)}/domains/${encodeURIComponent(domainId)}`, { method: 'DELETE', token, isAdmin: true }),
  setPrimaryWebsiteDomain: (token, id, domainId) => request(`/api/admin/websites/${encodeURIComponent(id)}/domains/${encodeURIComponent(domainId)}/primary`, { method: 'POST', token, isAdmin: true }),

  // ─── Website Product Assignment / Approval / Publishing ───────────
  listWebsiteProducts: (token, id, params) => request(`/api/admin/websites/${encodeURIComponent(id)}/products${toQuery(params)}`, { token, isAdmin: true }),
  getWebsiteProduct: (token, id, productId) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}`, { token, isAdmin: true }),
  assignWebsiteProduct: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/products`, { method: 'POST', token, isAdmin: true, body: payload }),
  bulkAssignWebsiteProducts: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/bulk-assign`, { method: 'POST', token, isAdmin: true, body: payload }),
  updateWebsiteProduct: (token, id, productId, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  unassignWebsiteProduct: (token, id, productId) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}`, { method: 'DELETE', token, isAdmin: true }),
  approveWebsiteProduct: (token, id, productId) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}/approve`, { method: 'POST', token, isAdmin: true }),
  rejectWebsiteProduct: (token, id, productId, rejectReason) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}/reject`, { method: 'POST', token, isAdmin: true, body: { rejectionReason: rejectReason } }),
  publishWebsiteProduct: (token, id, productId) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}/publish`, { method: 'POST', token, isAdmin: true }),
  unpublishWebsiteProduct: (token, id, productId) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/${encodeURIComponent(productId)}/unpublish`, { method: 'POST', token, isAdmin: true }),
  bulkApproveWebsiteProducts: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/bulk-approve`, { method: 'POST', token, isAdmin: true, body: payload }),
  bulkPublishWebsiteProducts: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/products/bulk-publish`, { method: 'POST', token, isAdmin: true, body: payload }),

  // ─── Website Homepage Sections ────────────────────────────────────
  listHomepageSections: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage`, { token, isAdmin: true }),
  createHomepageSection: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage`, { method: 'POST', token, isAdmin: true, body: payload }),
  reorderHomepageSections: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage/reorder`, { method: 'POST', token, isAdmin: true, body: payload }),
  updateHomepageSection: (token, id, sectionId, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage/${encodeURIComponent(sectionId)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteHomepageSection: (token, id, sectionId) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage/${encodeURIComponent(sectionId)}`, { method: 'DELETE', token, isAdmin: true }),
  duplicateHomepageSection: (token, id, sectionId) => request(`/api/admin/websites/${encodeURIComponent(id)}/homepage/${encodeURIComponent(sectionId)}/duplicate`, { method: 'POST', token, isAdmin: true }),

  // ─── Website Navigation ───────────────────────────────────────────
  listNavigations: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/navigation`, { token, isAdmin: true }),
  createNavigationItem: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/navigation`, { method: 'POST', token, isAdmin: true, body: payload }),
  reorderNavigationItems: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/navigation/reorder`, { method: 'POST', token, isAdmin: true, body: payload }),
  updateNavigationItem: (token, id, itemId, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/navigation/${encodeURIComponent(itemId)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteNavigationItem: (token, id, itemId) => request(`/api/admin/websites/${encodeURIComponent(id)}/navigation/${encodeURIComponent(itemId)}`, { method: 'DELETE', token, isAdmin: true }),

  // ─── Website Banners ──────────────────────────────────────────────
  listBanners: (token, id) => request(`/api/admin/websites/${encodeURIComponent(id)}/banners`, { token, isAdmin: true }),
  createBanner: (token, id, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/banners`, { method: 'POST', token, isAdmin: true, body: payload }),
  updateBanner: (token, id, bannerId, payload) => request(`/api/admin/websites/${encodeURIComponent(id)}/banners/${encodeURIComponent(bannerId)}`, { method: 'PUT', token, isAdmin: true, body: payload }),
  deleteBanner: (token, id, bannerId) => request(`/api/admin/websites/${encodeURIComponent(id)}/banners/${encodeURIComponent(bannerId)}`, { method: 'DELETE', token, isAdmin: true }),
};

export default adminApi;
