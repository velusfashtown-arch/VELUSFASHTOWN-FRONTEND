import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getCustomerToken, setCustomerToken, clearCustomerToken, getCustomerProfile, setCustomerProfile } from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getCustomerToken());
  const [profile, setProfile] = useState(() => getCustomerProfile());

  const login = useCallback((newToken, customerProfile) => {
    setCustomerToken(newToken);
    setCustomerProfile(customerProfile);
    setToken(newToken);
    setProfile(customerProfile);
  }, []);

  const logout = useCallback(() => {
    clearCustomerToken();
    setToken(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback((customerProfile) => {
    setCustomerProfile(customerProfile);
    setProfile(customerProfile);
  }, []);

  const value = useMemo(() => ({
    token,
    profile,
    isLoggedIn: !!token,
    login,
    logout,
    updateProfile
  }), [token, profile, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

