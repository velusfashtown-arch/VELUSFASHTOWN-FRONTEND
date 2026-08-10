// api.js
//
// Backward-compatible facade over the centralized API services.
//
// Existing pages import `api` from this module and call `api.adminXxx(...)`.
// To keep every existing call site working without edits, this file maps the
// legacy `adminXxx` method names onto the consolidated services:
//   - admin.*      → adminApi (services/api/admin.api.js)
//   - storefront.* → storefrontApi (services/api/storefrontApi.js)
//   - website/customer → legacy website endpoints (kept here)
//
// This removes the duplicated request() logic that previously lived in this
// file while preserving the full public surface the app already uses.

import { request } from '../services/api/apiClient';
import { adminApi } from '../services/api/admin.api';
import { storefrontApi } from '../services/api/storefrontApi';

export const api = {
  // ══════════════════════════════════════════════════════════════════
  // WEBSITE (storefront) — public
  // ══════════════════════════════════════════════════════════════════
  listProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ).toString();
    return request(`/api/website/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/api/website/products/${encodeURIComponent(id)}`),
  getRelatedProducts: (id) => request(`/api/website/products/${encodeURIComponent(id)}/related`),
  getBestSellers: (limit = 8) => request(`/api/website/products/best-seller?limit=${limit}`),
  getRecommended: (limit = 8) => request(`/api/website/products/recommended?limit=${limit}`),
  checkDelivery: (payload) => request('/api/website/products/check-delivery', { method: 'POST', body: payload }),
  createOrder: (token, payload) => request('/api/website/orders', { method: 'POST', token, body: payload }),
  createPaymentOrder: (orderId) => request('/api/website/payments/create-order', { method: 'POST', body: { orderId } }),
  verifyPayment: (payload) => request('/api/website/payments/verify', { method: 'POST', body: payload }),
  recordPaymentFailure: (payload) => request('/api/website/payments/failed', { method: 'POST', body: payload }),

  // Website customer auth
  register: (payload) => request('/api/website/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/website/auth/login', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/website/auth/forgot-password', { method: 'POST', body: payload }),
  verifyOtp: (payload) => request('/api/website/auth/verify-otp', { method: 'POST', body: payload }),
  resetPassword: (payload) => request('/api/website/auth/reset-password', { method: 'POST', body: payload }),
  getProfile: (token) => request('/api/website/auth/me', { token }),
  updateProfile: (token, payload) => request('/api/website/auth/me', { method: 'PUT', token, body: payload }),
  addAddress: (token, payload) => request('/api/website/auth/addresses', { method: 'POST', token, body: payload }),
  updateAddress: (token, addressId, payload) => request(`/api/website/auth/addresses/${encodeURIComponent(addressId)}`, { method: 'PUT', token, body: payload }),
  deleteAddress: (token, addressId) => request(`/api/website/auth/addresses/${encodeURIComponent(addressId)}`, { method: 'DELETE', token }),
  myOrders: (token, params) => {
    const query = params ? toQuery(params) : '';
    return request(`/api/website/orders/mine${query}`, { token });
  },

  // ══════════════════════════════════════════════════════════════════
  // ADMIN AUTH
  // ══════════════════════════════════════════════════════════════════
  adminLogin: (payload) => adminApi.login(payload),
  adminForgotPassword: (payload) => adminApi.forgotPassword(payload),
  adminResetPassword: (payload) => adminApi.resetPassword(payload),
  adminChangePassword: (token, payload) => adminApi.changePassword(token, payload),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN PRODUCTS
  // ══════════════════════════════════════════════════════════════════
  adminListProducts: (token, params) => adminApi.listProducts(token, params),
  adminReserveProductId: (token) => adminApi.reserveProductId(token),
  adminCreateProduct: (token, payload) => adminApi.createProduct(token, payload),
  adminUpdateProduct: (token, id, payload) => adminApi.updateProduct(token, id, payload),
  adminDeleteProduct: (token, id) => adminApi.deleteProduct(token, id),
  adminGetProduct: (token, id) => adminApi.getProduct(token, id),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN CATEGORIES
  // ══════════════════════════════════════════════════════════════════
  adminListCategories: (token, params) => adminApi.listCategories(token, params),
  adminGetCategoryTree: (token) => adminApi.getCategoryTree(token),
  adminGetCategory: (token, id) => adminApi.getCategory(token, id),
  adminGetCategoryChildren: (token, id) => adminApi.getCategoryChildren(token, id),
  adminCreateCategory: (token, payload) => adminApi.createCategory(token, payload),
  adminUpdateCategory: (token, id, payload) => adminApi.updateCategory(token, id, payload),
  adminDeleteCategory: (token, id) => adminApi.deleteCategory(token, id),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN COLLECTIONS
  // ══════════════════════════════════════════════════════════════════
  adminListCollections: (token, params) => adminApi.listCollections(token, params),
  adminGetCollection: (token, id) => adminApi.getCollection(token, id),
  adminCreateCollection: (token, payload) => adminApi.createCollection(token, payload),
  adminUpdateCollection: (token, id, payload) => adminApi.updateCollection(token, id, payload),
  adminDeleteCollection: (token, id) => adminApi.deleteCollection(token, id),
  adminAddProductsToCollection: (token, id, payload) => adminApi.addProductsToCollection(token, id, payload),
  adminRemoveProductsFromCollection: (token, id, payload) => adminApi.removeProductsFromCollection(token, id, payload),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN ORDERS
  // ══════════════════════════════════════════════════════════════════
  adminListOrders: (token, params) => adminApi.listOrders(token, params),
  adminGetOrder: (token, id) => adminApi.getOrder(token, id),
  adminUpdateOrder: (token, id, payload) => adminApi.updateOrder(token, id, payload),
  adminDeleteOrder: (token, id) => adminApi.deleteOrder(token, id),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN CUSTOMERS
  // ══════════════════════════════════════════════════════════════════
  adminListCustomers: (token, params) => adminApi.listCustomers(token, params),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN DASHBOARD
  // ══════════════════════════════════════════════════════════════════
  adminGetDashboard: (token) => adminApi.getDashboard(token),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN UPLOAD
  // ══════════════════════════════════════════════════════════════════
  adminUploadImages: (token, formData, productId) => adminApi.uploadImages(token, formData, productId),
  adminDeleteImage: (token, filename) => adminApi.deleteImage(token, filename),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN SHIPPING / COURIER / RTO
  // ══════════════════════════════════════════════════════════════════
  adminListCouriers: (token) => adminApi.listCouriers(token),
  adminAssignCourier: (token, orderId, payload) => adminApi.assignCourier(token, orderId, payload),
  adminManageRTO: (token, orderId, payload) => adminApi.manageRTO(token, orderId, payload),
  adminCancelRTO: (token, orderId) => adminApi.cancelRTO(token, orderId),
  adminShiprocketPush: (token, orderId) => adminApi.shiprocketPush(token, orderId),
  adminShiprocketTrack: (token, orderId) => adminApi.shiprocketTrack(token, orderId),
  adminGenerateLabel: (token, orderId) => adminApi.generateLabel(token, orderId),

  // ══════════════════════════════════════════════════════════════════
  // ADMIN WEBSITES (multi-tenant) — previously missing
  // ══════════════════════════════════════════════════════════════════
  adminListWebsites: (token, params) => adminApi.listWebsites(token, params),
  adminGetWebsite: (token, id) => adminApi.getWebsite(token, id),
  adminCreateWebsite: (token, payload) => adminApi.createWebsite(token, payload),
  adminUpdateWebsite: (token, id, payload) => adminApi.updateWebsite(token, id, payload),
  adminDeleteWebsite: (token, id) => adminApi.deleteWebsite(token, id),
  adminActivateWebsite: (token, id) => adminApi.activateWebsite(token, id),
  adminDeactivateWebsite: (token, id) => adminApi.deactivateWebsite(token, id),

  // ── Admin Website Domains ──
  adminListWebsiteDomains: (token, id) => adminApi.listWebsiteDomains(token, id),
  adminAddWebsiteDomain: (token, id, payload) => adminApi.addWebsiteDomain(token, id, payload),
  adminRemoveWebsiteDomain: (token, id, domainId) => adminApi.removeWebsiteDomain(token, id, domainId),
  adminSetPrimaryWebsiteDomain: (token, id, domainId) => adminApi.setPrimaryWebsiteDomain(token, id, domainId),

  // ── Admin Website Products (assignment / approval / publishing) ──
  adminListWebsiteProducts: (token, id, params) => adminApi.listWebsiteProducts(token, id, params),
  adminGetWebsiteProduct: (token, id, productId) => adminApi.getWebsiteProduct(token, id, productId),
  adminAssignWebsiteProduct: (token, id, payload) => adminApi.assignWebsiteProduct(token, id, payload),
  adminBulkAssignWebsiteProducts: (token, id, payload) => adminApi.bulkAssignWebsiteProducts(token, id, payload),
  adminUpdateWebsiteProduct: (token, id, productId, payload) => adminApi.updateWebsiteProduct(token, id, productId, payload),
  adminUnassignWebsiteProduct: (token, id, productId) => adminApi.unassignWebsiteProduct(token, id, productId),
  adminApproveWebsiteProduct: (token, id, productId) => adminApi.approveWebsiteProduct(token, id, productId),
  adminRejectWebsiteProduct: (token, id, productId, rejectReason) => adminApi.rejectWebsiteProduct(token, id, productId, rejectReason),
  adminPublishWebsiteProduct: (token, id, productId) => adminApi.publishWebsiteProduct(token, id, productId),
  adminUnpublishWebsiteProduct: (token, id, productId) => adminApi.unpublishWebsiteProduct(token, id, productId),
  adminBulkApproveWebsiteProducts: (token, id, payload) => adminApi.bulkApproveWebsiteProducts(token, id, payload),
  adminBulkPublishWebsiteProducts: (token, id, payload) => adminApi.bulkPublishWebsiteProducts(token, id, payload),

  // ── Admin Website Homepage Sections ──
  adminListHomepageSections: (token, id) => adminApi.listHomepageSections(token, id),
  adminCreateHomepageSection: (token, id, payload) => adminApi.createHomepageSection(token, id, payload),
  adminReorderHomepageSections: (token, id, payload) => adminApi.reorderHomepageSections(token, id, payload),
  adminUpdateHomepageSection: (token, id, sectionId, payload) => adminApi.updateHomepageSection(token, id, sectionId, payload),
  adminDeleteHomepageSection: (token, id, sectionId) => adminApi.deleteHomepageSection(token, id, sectionId),
  adminDuplicateHomepageSection: (token, id, sectionId) => adminApi.duplicateHomepageSection(token, id, sectionId),

  // ── Admin Website Navigation ──
  adminListNavigations: (token, id) => adminApi.listNavigations(token, id),
  adminCreateNavigationItem: (token, id, payload) => adminApi.createNavigationItem(token, id, payload),
  adminReorderNavigationItems: (token, id, payload) => adminApi.reorderNavigationItems(token, id, payload),
  adminUpdateNavigationItem: (token, id, itemId, payload) => adminApi.updateNavigationItem(token, id, itemId, payload),
  adminDeleteNavigationItem: (token, id, itemId) => adminApi.deleteNavigationItem(token, id, itemId),

  // ── Admin Website Banners ──
  adminListBanners: (token, id) => adminApi.listBanners(token, id),
  adminCreateBanner: (token, id, payload) => adminApi.createBanner(token, id, payload),
  adminUpdateBanner: (token, id, bannerId, payload) => adminApi.updateBanner(token, id, bannerId, payload),
  adminDeleteBanner: (token, id, bannerId) => adminApi.deleteBanner(token, id, bannerId),
};

// Legacy storefront API surface (kept for components that import stores).
export const storefrontApiForExport = storefrontApi;

// Local helper used by myOrders above.
function toQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString();
  return query ? `?${query}` : '';
}

export default api;
