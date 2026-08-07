const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Default per-request timeout. If the server/DB is slow or down, the request
// will fail fast with a clear error instead of hanging "pending" forever.
const REQUEST_TIMEOUT_MS = 15000;

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection and try again.');
    }
    throw new Error('Network error. Unable to reach the server.');
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && window.location.pathname.startsWith('/admin')) {
      window.localStorage.removeItem('admin_token');
      window.location.replace('/admin');
    }
    const message = data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  // ─── Website (Public) ────────────────────────────────────────────────
  listProducts: (params = {}) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString();
    return request(`/api/website/products${query ? `?${query}` : ''}`);
  },
  getProduct: (id) => request(`/api/website/products/${id}`),
  getRelatedProducts: (id) => request(`/api/website/products/${id}/related`),
  getBestSellers: (limit = 8) => request(`/api/website/products/best-seller?limit=${limit}`),
  getRecommended: (limit = 8) => request(`/api/website/products/recommended?limit=${limit}`),
  checkDelivery: (payload) => request('/api/website/products/check-delivery', { method: 'POST', body: payload }),
  createOrder: (token, payload) => request('/api/website/orders', { method: 'POST', token, body: payload }),
  createPaymentOrder: (orderId) => request('/api/website/payments/create-order', { method: 'POST', body: { orderId } }),
  verifyPayment: (payload) => request('/api/website/payments/verify', { method: 'POST', body: payload }),
  recordPaymentFailure: (payload) => request('/api/website/payments/failed', { method: 'POST', body: payload }),

  // ─── Website Auth (Public) ───────────────────────────────────────────
  register: (payload) => request('/api/website/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/website/auth/login', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/website/auth/forgot-password', { method: 'POST', body: payload }),
  verifyOtp: (payload) => request('/api/website/auth/verify-otp', { method: 'POST', body: payload }),
  resetPassword: (payload) => request('/api/website/auth/reset-password', { method: 'POST', body: payload }),
  getProfile: (token) => request('/api/website/auth/me', { token }),
  updateProfile: (token, payload) => request('/api/website/auth/me', { method: 'PUT', token, body: payload }),
  addAddress: (token, payload) => request('/api/website/auth/addresses', { method: 'POST', token, body: payload }),
  updateAddress: (token, addressId, payload) => request(`/api/website/auth/addresses/${addressId}`, { method: 'PUT', token, body: payload }),
  deleteAddress: (token, addressId) => request(`/api/website/auth/addresses/${addressId}`, { method: 'DELETE', token }),
  myOrders: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/website/orders/mine${query}`, { token });
  },

  // ─── Admin Auth ───────────────────────────────────────────────────────
  adminLogin: (payload) => request('/api/admin/auth/login', { method: 'POST', body: payload }),
  adminForgotPassword: (payload) => request('/api/admin/auth/forgot-password', { method: 'POST', body: payload }),
  adminResetPassword: (payload) => request('/api/admin/auth/reset-password', { method: 'POST', body: payload }),

  // ─── Admin Products ───────────────────────────────────────────────────
  adminListProducts: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/admin/products${query}`, { token });
  },
  adminReserveProductId: (token) => request('/api/admin/products/reserve-id', { method: 'POST', token }),
  adminCreateProduct: (token, payload) => request('/api/admin/products', { method: 'POST', token, body: payload }),
  adminUpdateProduct: (token, id, payload) => request(`/api/admin/products/${id}`, { method: 'PUT', token, body: payload }),
  adminDeleteProduct: (token, id) => request(`/api/admin/products/${id}`, { method: 'DELETE', token }),
  adminGetProduct: (token, id) => request(`/api/admin/products/${id}`, { token }),

  // ─── Admin Orders ─────────────────────────────────────────────────────
  adminListOrders: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/admin/orders${query}`, { token });
  },
  adminGetOrder: (token, id) => request(`/api/admin/orders/${id}`, { token }),
  adminUpdateOrder: (token, id, payload) => request(`/api/admin/orders/${id}`, { method: 'PATCH', token, body: payload }),
  adminDeleteOrder: (token, id) => request(`/api/admin/orders/${id}`, { method: 'DELETE', token }),

  // ─── Admin Customers ──────────────────────────────────────────────────
  adminListCustomers: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/admin/customers${query}`, { token });
  },

  // ─── Admin Categories ─────────────────────────────────────────────────
  adminListCategories: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/admin/categories${query}`, { token });
  },
  adminGetCategoryTree: (token) => request('/api/admin/categories/tree', { token }),
  adminGetCategory: (token, id) => request(`/api/admin/categories/${id}`, { token }),
  adminGetCategoryChildren: (token, id) => request(`/api/admin/categories/${id}/children`, { token }),
  adminCreateCategory: (token, payload) => request('/api/admin/categories', { method: 'POST', token, body: payload }),
  adminUpdateCategory: (token, id, payload) => request(`/api/admin/categories/${id}`, { method: 'PUT', token, body: payload }),
  adminDeleteCategory: (token, id) => request(`/api/admin/categories/${id}`, { method: 'DELETE', token }),

  // ─── Admin Collections ────────────────────────────────────────────────
  adminListCollections: (token, params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/api/admin/collections${query}`, { token });
  },
  adminGetCollection: (token, id) => request(`/api/admin/collections/${id}`, { token }),
  adminCreateCollection: (token, payload) => request('/api/admin/collections', { method: 'POST', token, body: payload }),
  adminUpdateCollection: (token, id, payload) => request(`/api/admin/collections/${id}`, { method: 'PUT', token, body: payload }),
  adminDeleteCollection: (token, id) => request(`/api/admin/collections/${id}`, { method: 'DELETE', token }),
  adminAddProductsToCollection: (token, id, payload) => request(`/api/admin/collections/${id}/products`, { method: 'POST', token, body: payload }),
  adminRemoveProductsFromCollection: (token, id, payload) => request(`/api/admin/collections/${id}/products`, { method: 'DELETE', token, body: payload }),

  // ─── Admin Management ─────────────────────────────────────────────────
  adminListAdmins: (token) => request('/api/admin/auth/admins', { token }),
  adminUpdateAdmin: (token, id, payload) => request(`/api/admin/auth/admins/${id}`, { method: 'PUT', token, body: payload }),
  adminDeleteAdmin: (token, id) => request(`/api/admin/auth/admins/${id}`, { method: 'DELETE', token }),

  // ─── Image Upload ─────────────────────────────────────────────────────
  adminUploadImages: (token, formData, productId) => {
    return fetch(`${API_BASE_URL}/api/admin/upload/${productId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Upload failed');
      return data;
    });
  },
  adminDeleteImage: (token, filename) => request('/api/admin/upload', { method: 'DELETE', token, body: { filename } }),

  // ─── Dashboard ────────────────────────────────────────────────────────
  adminGetDashboard: (token) => request('/api/admin/dashboard', { token }),

  // ─── Shipping / Courier / RTO ─────────────────────────────────────────
  adminListCouriers: (token) => request('/api/admin/shipping/couriers', { token }),
  adminAssignCourier: (token, orderId, payload) => request(`/api/admin/shipping/${orderId}/assign`, { method: 'POST', token, body: payload }),
  adminManageRTO: (token, orderId, payload) => request(`/api/admin/shipping/${orderId}/rto`, { method: 'POST', token, body: payload }),
  adminCancelRTO: (token, orderId) => request(`/api/admin/shipping/${orderId}/cancel-rto`, { method: 'POST', token }),
  adminShiprocketPush: (token, orderId) => request(`/api/admin/shipping/${orderId}/shiprocket/push`, { method: 'POST', token }),
  adminShiprocketTrack: (token, orderId) => request(`/api/admin/shipping/${orderId}/shiprocket/track`, { token }),
  adminGenerateLabel: (token, orderId) => {
    // For HTML label, open in new window
    const url = `${API_BASE_URL}/api/admin/shipping/${orderId}/label`;
    window.open(url + '?token=' + token, '_blank');
    return Promise.resolve({ ok: true });
  },
};
