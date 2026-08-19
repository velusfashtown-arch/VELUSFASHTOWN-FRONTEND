// Websites/List.js
// Admin website list — create, edit, activate/deactivate, preview, delete.

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

const STATUS_BADGE = {
  active: 'bg-[#e6f4ea] text-[#137333]',
  inactive: 'bg-[rgba(47,31,25,0.06)] text-muted',
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
    return <div className="animate-pulse text-sm text-muted">Loading websites…</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terra/10 text-terra">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a15 15 0 010 18 15 15 0 010-18z" /></svg>
          </div>
          <div>
            <h2 className="m-0 font-playfair text-xl font-semibold text-ink">Websites</h2>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">Manage your multi-website storefronts</p>
          </div>
        </div>
        <Link
          to="/admin/websites/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-terra px-4 py-3 text-[12px] font-bold uppercase leading-none tracking-[0.06em] text-[#fffaf5] no-underline shadow-[0_2px_8px_rgba(167,78,62,0.28)] transition-all duration-200 hover:bg-wine hover:shadow-[0_4px_14px_rgba(167,78,62,0.36)] active:scale-[0.97]"
        >
          <span className="text-base leading-none">+</span> Create Website
        </Link>
      </div>

      {websites.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
          <p className="text-sm text-muted">No websites yet. Create your first website to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[rgba(47,31,25,0.1)] bg-paper shadow-[0_12px_32px_rgba(47,31,25,0.06)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[rgba(47,31,25,0.08)] bg-[linear-gradient(115deg,rgba(255,255,255,0.92),rgba(250,245,239,0.92))] text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
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
                <tr key={w.id} className="border-b border-[rgba(47,31,25,0.06)] odd:bg-white even:bg-[rgba(250,245,239,0.45)] transition-colors last:border-0 hover:bg-[rgba(167,78,62,0.055)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {w.logo ? (
                        <img src={w.logo} alt="" className="h-9 w-9 rounded-md object-cover" />
                      ) : (
                        <span className="grid h-9 w-9 place-items-center rounded-md bg-terra/10 text-[10px] font-bold uppercase text-terra">
                          {(w.brandName || w.name || 'S').slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <Link to={`/admin/websites/${w.id}`} className="block truncate font-semibold text-ink no-underline hover:text-terra">
                          {w.brandName || w.name}
                        </Link>
                        <span className="text-[11px] text-muted">/{w.slug}</span>
                        {w.isDefault ? <span className="ml-2 rounded bg-terra/10 px-1.5 py-0.5 text-[9px] font-bold text-terra">DEFAULT</span> : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{w.domain || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[w.status] || 'bg-neutral-100 text-neutral-500'}`}>
                      {w.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">{formatDate(w.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/store/${w.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-md px-2 py-1 text-[11px] font-semibold text-muted no-underline hover:bg-sand hover:text-ink">Preview</Link>
                      <button type="button" onClick={() => navigate(`/admin/websites/${w.id}`)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-muted hover:bg-sand hover:text-ink">Edit</button>
                      <button type="button" onClick={() => toggleStatus(w)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-muted hover:bg-sand hover:text-ink">
                        {w.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button type="button" onClick={() => handleDelete(w)} className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Delete</button>
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
