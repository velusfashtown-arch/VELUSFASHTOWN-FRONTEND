// AdminWebsiteContext.js
//
// Global admin website switcher state. Lets the admin select:
//   - null  → "All Websites" (platform-wide view)
//   - id    → a specific Website (website-scoped view)
//
// Relevant admin pages (dashboard, orders, customers, products, content,
// analytics) can read `selectedWebsiteId` to scope their data where the
// backend supports it.

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { api } from '../lib/api';
import { getToken } from '../lib/auth';

const AdminWebsiteContext = createContext(null);

export function AdminWebsiteProvider({ children }) {
  const [websites, setWebsites] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null); // null = All Websites
  const [loading, setLoading] = useState(false);

  const refreshWebsites = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.adminListWebsites(token, { limit: 100 });
      const data = res?.data || res?.websites || [];
      setWebsites(Array.isArray(data) ? data : []);
    } catch {
      // Non-fatal — admin can still work without the switcher populated.
    } finally {
      setLoading(false);
    }
  }, []);

  const selectedWebsite = useMemo(
    () => websites.find((w) => String(w.id) === String(selectedWebsiteId)) || null,
    [websites, selectedWebsiteId]
  );

  const value = useMemo(
    () => ({
      websites,
      selectedWebsiteId,
      selectedWebsite,
      setSelectedWebsiteId,
      refreshWebsites,
      loading,
    }),
    [websites, selectedWebsiteId, selectedWebsite, refreshWebsites, loading]
  );

  return <AdminWebsiteContext.Provider value={value}>{children}</AdminWebsiteContext.Provider>;
}

export function useAdminWebsite() {
  const context = useContext(AdminWebsiteContext);
  if (!context) throw new Error('useAdminWebsite must be used inside AdminWebsiteProvider');
  return context;
}
