// storefrontApi.js
//
// Reusable, website-aware storefront API service.
// All endpoints hit the multi-tenant storefront API:
//   /api/storefront/store/:websiteSlug/...
// The backend resolveWebsite middleware reads the /store/:slug path to
// resolve the current Website, so no website is ever hard-coded here.
//
// Uses the centralized `request` helper from ./apiClient.js.

import { request, toQuery } from './apiClient';

function base(slug) {
  return `/api/storefront/store/${encodeURIComponent(slug)}`;
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

export default storefrontApi;
