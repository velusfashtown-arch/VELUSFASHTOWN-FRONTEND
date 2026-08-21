// Websites/List.js
// Admin website list — create, edit, activate/deactivate, preview, delete.

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import PageHeader from '../../Common/PageHeader';
import { adminBtnPrimary } from '../../Common/buttonClasses';

function WebsitesPageIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 010 18 15 15 0 010-18z" /></svg>;
}

const STATUS_BADGE = {
  active: 'bg-admin-success-light text-admin-success',
  inactive: 'bg-admin-bg text-admin-muted',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function WebsitesList() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminListWebsites(token, { limit: 100 });
      const data = res?.data || res?.websites || [];
      setWebsites(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load websites');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(w) {
    try {
      if (w.status === 'active') {
        await api.adminDeactivateWebsite(token, w.id);
      } else {
        await api.adminActivateWebsite(token, w.id);
      }
      await load();
    } catch (err) {
      alert(err.message || 'Action failed');
    }
  }

  async function handleDelete(w) {
    if (!window.confirm(`Delete website "${w.name}"? This deactivates it.`)) return;
    try {
      await api.adminDeleteWebsite(token, w.id);
      await load();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  }

  if (loading) {
    return <div className="animate-pulse text-sm text-admin-muted">Loading websites…</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-admin-danger/20 bg-admin-danger-light p-4 text-sm text-admin-danger">{error}</div>;
  }

  return (
    <div>
      <PageHeader
        icon={<WebsitesPageIcon />}
        title="Websites"
        description="Manage your multi-website storefronts — branding, domains and publishing."
        actions={<Link to="/admin/websites/new" className={adminBtnPrimary}><span className="text-base leading-none">+</span> Create Website</Link>}
      />

      {websites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-admin-border bg-white p-12 text-center shadow-card">
          <p className="text-sm text-admin-muted">No websites yet. Create your first website to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-admin-border bg-admin-bg text-[10px] font-bold uppercase tracking-[0.12em] text-admin-muted">
              <tr>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {websites.map((w) => (
                <tr key={w.id} className="border-b border-admin-border/50 odd:bg-white even:bg-admin-bg/30 transition-colors last:border-0 hover:bg-admin-primary-light/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {w.logo ? (
                        <img src={w.logo} alt="" className="h-9 w-9 rounded-md object-cover" />
                      ) : (
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-admin-primary-light text-[10px] font-bold uppercase text-admin-primary">
                          {(w.brandName || w.name || 'S').slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <Link to={`/admin/websites/${w.id}`} className="block truncate font-semibold text-admin-text no-underline hover:text-admin-primary">
                          {w.brandName || w.name}
                        </Link>
                        <span className="text-[11px] text-admin-muted">/{w.slug}</span>
                        {w.isDefault ? <span className="ml-2 rounded bg-admin-primary-light px-1.5 py-0.5 text-[9px] font-bold text-admin-primary">DEFAULT</span> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-admin-muted">{w.domain || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[w.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      {w.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-admin-muted">{formatDate(w.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/store/${w.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-md px-2 py-1 text-[11px] font-semibold text-admin-muted no-underline hover:bg-admin-bg hover:text-admin-text">Preview</Link>
                      <button type="button" onClick={() => navigate(`/admin/websites/${w.id}`)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-admin-muted hover:bg-admin-bg hover:text-admin-text">Edit</button>
                      <button type="button" onClick={() => toggleStatus(w)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-admin-muted hover:bg-admin-bg hover:text-admin-text">
                        {w.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button type="button" onClick={() => handleDelete(w)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-admin-danger transition-colors hover:bg-admin-danger-light">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}