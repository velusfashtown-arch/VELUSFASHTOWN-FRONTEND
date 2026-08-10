import { request, toQuery } from './../../../services/api/apiClient';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const authApi = {
    // ─── Admin Auth ────────────────────────────────────────────────────
    login: (payload) => request('/api/admin/auth/login', { method: 'POST', body: payload }),
    forgotPassword: (payload) => request('/api/admin/auth/forgot-password', { method: 'POST', body: payload }),
    resetPassword: (payload) => request('/api/admin/auth/reset-password', { method: 'POST', body: payload }),
    changePassword: (token, payload) => request('/api/admin/auth/change-password', { method: 'POST', token, isAdmin: true, body: payload }),
};

export default authApi;