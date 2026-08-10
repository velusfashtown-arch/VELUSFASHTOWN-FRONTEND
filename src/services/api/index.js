// services/api/index.js
//
// Barrel export for all API services. New code should prefer importing from
// here (or from the specific module) rather than from src/lib.

export { default as apiClient, request, toQuery } from './apiClient';
export { default as adminApi, adminApi as adminApiNamed } from './admin.api';
export { default as storefrontApi, storefrontApi as storefrontApiNamed } from './storefrontApi';
