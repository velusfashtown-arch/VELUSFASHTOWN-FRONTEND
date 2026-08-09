// Websites/Banners.js
// Banner management for a website — title, subtitle, desktop/mobile
// images, CTA, scheduling, sort order and active status.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

function emptyBanner() {
  return {
    title: '',
    subtitle: '',
    desktopImage: '',
    mobileImage: '',
    buttonText: '',
    buttonUrl: '',
    startDate: '',
    endDate: '',
    status: 'active',
  };
}

export default function Banners() {
  const { id } = useParams();
  const token = getToken();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.adminListBanners(token, id)
      .then((res) => setBanners(res?.data || []))
      .catch((err) => setError(err.message || 'Failed to load banners'))
      .finally(() => setLoading(false));
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(emptyBanner());
    setIsNew(true);
  }

  function openEdit(banner) {
    setEditing({
      ...banner,
      startDate: banner.startDate ? String(banner.startDate).slice(0, 10) : '',
      endDate: banner.endDate ? String(banner.endDate).slice(0, 10) : '',
    });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const payload = { ...editing };
      payload.startDate = payload.startDate || null;
      payload.endDate = payload.endDate || null;
      if (isNew) {
        await api.adminCreateBanner(token, id, payload);
      } else {
        await api.adminUpdateBanner(token, id, editing._id, payload);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(bannerId) {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.adminDeleteBanner(token, id, bannerId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete banner');
    }
  }

  async function handleToggle(banner) {
    const nextStatus = banner.status === 'active' ? 'inactive' : 'active';
    try {
      await api.adminUpdateBanner(token, id, banner._id, { status: nextStatus });
      load();
    } catch (err) {
      setError(err.message || 'Failed to update banner');
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading banners…</div>;

  return (
    <div className="space-y-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{banners.length} banner(s).</p>
        <button type="button" onClick={openNew} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-wine">
          + Add Banner
        </button>
      </div>

      {banners.length === 0 && !editing ? (
        <div className="rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-muted">No banners yet.</div>
      ) : null}

      <div className="space-y-3">
        {banners.map((banner) => (
          <div key={banner._id} className={`rounded-xl border border-line bg-paper p-4 ${banner.status !== 'active' ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${banner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-muted'}`}>{banner.status}</span>
                  {banner.startDate ? <span className="text-[11px] text-muted">{banner.startDate} → {banner.endDate || '∞'}</span> : null}
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-ink">{banner.title || 'Untitled banner'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => handleToggle(banner)} className="rounded border border-line px-2 py-1.5 text-xs text-muted hover:bg-cream">{banner.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                <button type="button" onClick={() => openEdit(banner)} className="rounded border border-line px-2 py-1.5 text-xs font-semibold text-terra hover:bg-cream">Edit</button>
                <button type="button" onClick={() => handleDelete(banner._id)} className="rounded border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{isNew ? 'Add Banner' : 'Edit Banner'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Title</label>
                <input className={inputClass} value={editing.title || ''} onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Subtitle</label>
                <input className={inputClass} value={editing.subtitle || ''} onChange={(e) => setEditing((prev) => ({ ...prev, subtitle: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Desktop Image URL</label>
                <input className={inputClass} value={editing.desktopImage || ''} onChange={(e) => setEditing((prev) => ({ ...prev, desktopImage: e.target.value }))} placeholder="/images/Home/Banner/01.png" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Mobile Image URL</label>
                <input className={inputClass} value={editing.mobileImage || ''} onChange={(e) => setEditing((prev) => ({ ...prev, mobileImage: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Button Text</label>
                  <input className={inputClass} value={editing.buttonText || ''} onChange={(e) => setEditing((prev) => ({ ...prev, buttonText: e.target.value }))} placeholder="Shop Now" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Button URL</label>
                  <input className={inputClass} value={editing.buttonUrl || ''} onChange={(e) => setEditing((prev) => ({ ...prev, buttonUrl: e.target.value }))} placeholder="/shop" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Start Date</label>
                  <input type="date" className={inputClass} value={editing.startDate || ''} onChange={(e) => setEditing((prev) => ({ ...prev, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">End Date</label>
                  <input type="date" className={inputClass} value={editing.endDate || ''} onChange={(e) => setEditing((prev) => ({ ...prev, endDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Status</label>
                <select className={inputClass} value={editing.status} onChange={(e) => setEditing((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-wine disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
