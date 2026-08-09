// storefrontApi.js
// Reusable, website-aware storefront API service.
// All endpoints hit the multi-tenant storefront API:
//   /api/storefront/store/:websiteSlug/...
// The backend resolveWebsite middleware reads the /store/:slug path to
// resolve the current Website, so no website is ever hard-coded here.

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const REQUEST_TIMEOUT_MS = 15000;

async function request(path, { method = 'GET', token, body } = {}) {
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
    const message = data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data;
}

function base(slug) {
  return `/api/storefront/store/${encodeURIComponent(slug)}`;
}

function toQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  ).toString();
  return query ? `?${query}` : '';
}

export const storefrontApi = {
  home: (slug) => request(`${base(slug)}/home`),
  products: (slug, params = {}) => request(`${base(slug)}/products${toQuery(params)}`),
  product: (slug, productSlug) => request(`${base(slug)}/products/${encodeURIComponent(productSlug)}`),
  categories: (slug) => request(`${base(slug)}/categories`),
  collections: (slug) => request(`${base(slug)}/collections`),
  navigation: (slug) => request(`${base(slug)}/navigation`),
  page: (slug, pageSlug) => request(`${base(slug)}/pages/${encodeURIComponent(pageSlug)}`),
  search: (slug, params = {}) => request(`${base(slug)}/search${toQuery(params)}`),
};
