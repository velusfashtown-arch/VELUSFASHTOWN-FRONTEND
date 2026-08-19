// Websites/Domains.js
// Manage the custom domains bound to a website. The storefront resolves
// the current website from the incoming hostname via WebsiteDomain.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnPrimary } from '../../Common/buttonClasses';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';

export default function Domains() {
  const { id } = useParams();
  const token = getToken();
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDomain, setNewDomain] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.adminListWebsiteDomains(token, id)
      .then((res) => {
        const data = res?.data || res?.domains || [];
        setDomains(Array.isArray(data) ? data : []);
      })
      .catch((err) => setError(err.message || 'Failed to load domains'))
      .finally(() => setLoading(false));
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd() {
    if (!newDomain.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await api.adminAddWebsiteDomain(token, id, newDomain.trim());
      setNewDomain('');
      load();
    } catch (err) {
      setError(err.message || 'Failed to add domain');
    } finally {
      setSaving(false);
    }
  }

  async function handleSetPrimary(domainId) {
    try {
      await api.adminSetPrimaryDomain(token, id, domainId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to set primary domain');
    }
  }

  async function handleRemove(domainId) {
    if (!window.confirm('Remove this domain?')) return;
    try {
      await api.adminRemoveWebsiteDomain(token, id, domainId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to remove domain');
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading domains…</div>;

  return (
    <div className="max-w-2xl space-y-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex gap-2">
        <input className={inputClass} value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="e.g. storeb.com" />
        <button type="button" onClick={handleAdd} disabled={saving || !newDomain.trim()} className={`shrink-0 ${adminBtnPrimary}`}>
          + Add
        </button>
      </div>

      {domains.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper p-10 text-center text-sm text-muted">
          No custom domains yet. Add a domain to point it to this website.
        </div>
      ) : (
        <div className="space-y-2">
          {domains.map((d) => (
            <div key={d._id} className="flex items-center justify-between rounded-xl border border-[rgba(47,31,25,0.1)] bg-paper p-3.5 shadow-[0_4px_16px_rgba(47,31,25,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(47,31,25,0.07)]">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {d.domain}
                  {d.isPrimary ? <span className="rounded-full bg-terra/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-terra">Primary</span> : null}
                </p>
                <p className="text-[11px] text-muted">
                  {d.verified ? 'Verified' : 'Not verified'} · SSL: {d.sslStatus || '—'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!d.isPrimary ? (
                  <button type="button" onClick={() => handleSetPrimary(d._id)} className="rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-terra transition-colors hover:border-terra/30 hover:bg-terra/10">Set Primary</button>
                ) : null}
                <button type="button" onClick={() => handleRemove(d._id)} className="rounded-md border border-[#f3d4d4] px-2.5 py-1.5 text-xs font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
