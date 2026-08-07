// ─── Admin Token ──────────────────────────────────────────────────────
export function getToken() {
  try {
    const token = window.localStorage.getItem('admin_token');
    // Guard against corrupted values: "undefined", "null", or empty string
    if (!token || token === 'undefined' || token === 'null') {
      window.localStorage.removeItem('admin_token');
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function setToken(token) {
  // Guard: never store "undefined" or "null" as literal strings
  if (!token || token === 'undefined' || token === 'null') {
    window.localStorage.removeItem('admin_token');
    return;
  }
  window.localStorage.setItem('admin_token', token);
}

export function clearToken() {
  window.localStorage.removeItem('admin_token');
}

export function isTokenExpired(token = getToken()) {
  if (!token) return true;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return !decodedPayload.exp || decodedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

// ─── Customer Token (Website Users) ──────────────────────────────────
export function getCustomerToken() {
  try {
    const token = window.localStorage.getItem('customer_token');
    if (!token || token === 'undefined' || token === 'null') {
      window.localStorage.removeItem('customer_token');
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function setCustomerToken(token) {
  if (!token || token === 'undefined' || token === 'null') {
    window.localStorage.removeItem('customer_token');
    window.localStorage.removeItem('customer_profile');
    return;
  }
  window.localStorage.setItem('customer_token', token);
}

export function clearCustomerToken() {
  window.localStorage.removeItem('customer_token');
  window.localStorage.removeItem('customer_profile');
}

// ─── Customer Profile Cache ──────────────────────────────────────────
export function getCustomerProfile() {
  try {
    const raw = window.localStorage.getItem('customer_profile');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerProfile(profile) {
  window.localStorage.setItem('customer_profile', JSON.stringify(profile));
}

