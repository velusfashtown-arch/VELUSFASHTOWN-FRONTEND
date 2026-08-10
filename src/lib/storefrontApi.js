// storefrontApi.js (compatibility shim)
//
// Re-exports the centralized storefront API service from the new feature
// location. Kept at this path so existing imports continue to work without
// edits. New code should import from `../services/api/storefrontApi`.

export { storefrontApi, default } from '../services/api/storefrontApi';
export * from '../services/api/storefrontApi';
