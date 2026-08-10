// apiClient.js
//
// Centralized HTTP client used by every API service in the app.
// Responsibilities:
//   - Base URL injection
//   - Auth header injection
//   - JSON serialization
//   - Timeout + abort handling
//   - Consistent error messages
//   - Admin 401 auto-logout
//
// This removes the duplicated request() logic that previously lived in
// both lib/api.js and lib/storefrontApi.js.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Default per-request timeout. If the server/DB is slow or down, the request
// fails fast with a clear error instead of hanging "pending" forever.
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Build a query string from a params object, skipping empty values.
 * @param {Object} params
 * @returns {string} e.g. "" or "?page=2&limit=10"
 */
export function toQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  ).toString();
  return query ? `?${query}` : '';
}

/**
 * Core request helper.
 * @param {string} path  Absolute API path (e.g. "/api/admin/products").
 * @param {Object} [options]
 * @param {string} [options.method]
 * @param {string} [options.token]  Bearer token (admin or customer).
 * @param {Object} [options.body]   JSON body.
 * @param {boolean} [options.isAdmin]  When true, 401 logs the admin out.
 * @returns {Promise<any>} Parsed JSON response.
 */
export async function request(path, { method = 'GET', token, body, isAdmin = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
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
    if (res.status === 401 && token && isAdmin && window.location.pathname.startsWith('/admin')) {
      window.localStorage.removeItem('admin_token');
      window.location.replace('/admin');
    }
    const message = data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export default request;
