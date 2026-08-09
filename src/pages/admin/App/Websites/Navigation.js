// Websites/Navigation.js
// Navigation Builder — database-driven menu items for a website.
// Supports header/footer/mega menus, nested (parent) items, and types
// (Category / Collection / Product / Page / Custom URL).

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

const NAVIGATION_TYPES = [
  { value: 'CUSTOM_URL', label: 'Custom URL' },
  { value: 'CATEGORY', label: 'Category' },
  { value: 'COLLECTION', label: 'Collection' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'PAGE', label: 'Page' },
];

const LOCATIONS = ['header', 'footer', 'mobile', 'mega'];

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

function emptyItem() {
  return {
    label: '',
    type: 'CUSTOM_URL',
    url: '',
    targetId: null,
    parent: null,
    location: 'header',
    isActive: true,
  };
}

export default function NavigationBuilder() {
  const { id } = useParams();
  const token = getToken();
  const [navigations, setNavigations] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.adminListNavigations(token, id)
      .then((res) => {
        const data = res?.data || {};
        setNavigations(data.navigations || []);
        setItems(data.items || []);
      })
      .catch((err) => setError(err.message || 'Failed to load navigation'))
      .finally(() => setLoading(false));
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  function openNew() {
    setEditing(emptyItem());
    setIsNew(true);
  }

  function openEdit(item) {
    setEditing({ ...item, parent: item.parent || null, targetId: item.targetId || null });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await api.adminCreateNavigationItem(token, id, editing);
      } else {
        await api.adminUpdateNavigationItem(token, id, editing._id, editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to save menu item');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId) {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.adminDeleteNavigationItem(token, id, itemId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete menu item');
    }
  }

  async function handleToggle(item) {
    try {
      await api.adminUpdateNavigationItem(token, id, item._id, { isActive: !item.isActive });
      load();
    } catch (err) {
      setError(err.message || 'Failed to update menu item');
    }
  }

  async function handleMove(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try {
      await api.adminReorderNavigationItems(token, id, next.map((i) => i._id));
    } catch {
      load();
    }
  }

  const locationName = (loc) => (loc || 'header').charAt(0).toUpperCase() + (loc || 'header').slice(1);

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading navigation…</div>;

  return (
    <div className="space-y-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{items.length} menu item(s). Manage header, footer, mobile and mega menus.</p>
        <button type="button" onClick={openNew} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-wine">
          + Add Menu Item
        </button>
      </div>

      {items.length === 0 && !editing ? (
        <div className="rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-muted">
          No menu items yet. Click "Add Menu Item" to build your navigation.
        </div>
      ) : null}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item._id} className={`rounded-lg border border-line bg-paper p-3 ${!item.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terra">{item.type}</span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">{locationName(item.navigationLocation || items.find((i) => i._id === item.navigation)?.location)}</span>
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-ink">{item.label || 'Untitled'}</p>
                {item.url ? <p className="truncate text-[11px] text-muted">{item.url}</p> : null}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="rounded border border-line p-1.5 text-xs text-muted hover:bg-cream disabled:opacity-40">↑</button>
                <button type="button" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} className="rounded border border-line p-1.5 text-xs text-muted hover:bg-cream disabled:opacity-40">↓</button>
                <button type="button" onClick={() => handleToggle(item)} className="rounded border border-line px-2 py-1.5 text-xs text-muted hover:bg-cream">{item.isActive ? 'Disable' : 'Enable'}</button>
                <button type="button" onClick={() => openEdit(item)} className="rounded border border-line px-2 py-1.5 text-xs font-semibold text-terra hover:bg-cream">Edit</button>
                <button type="button" onClick={() => handleDelete(item._id)} className="rounded border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{isNew ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Label</label>
                <input className={inputClass} value={editing.label} onChange={(e) => setEditing((prev) => ({ ...prev, label: e.target.value }))} placeholder="e.g. Silk Sarees" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Menu Location</label>
                <select className={inputClass} value={editing.location || 'header'} onChange={(e) => setEditing((prev) => ({ ...prev, location: e.target.value }))}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{locationName(l)}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Type</label>
                <select className={inputClass} value={editing.type} onChange={(e) => setEditing((prev) => ({ ...prev, type: e.target.value }))}>
                  {NAVIGATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {editing.type === 'CUSTOM_URL' ? (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">URL</label>
                  <input className={inputClass} value={editing.url || ''} onChange={(e) => setEditing((prev) => ({ ...prev, url: e.target.value }))} placeholder="/shop" />
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">Target ID</label>
                  <input className={inputClass} value={editing.targetId || ''} onChange={(e) => setEditing((prev) => ({ ...prev, targetId: e.target.value || null }))} placeholder={`${editing.type} ID`} />
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Parent (for nested / mega menu)</label>
                <select className={inputClass} value={editing.parent || ''} onChange={(e) => setEditing((prev) => ({ ...prev, parent: e.target.value || null }))}>
                  <option value="">None (top-level)</option>
                  {items.filter((i) => i.type === 'CUSTOM_URL' || true).map((i) => <option key={i._id} value={i._id}>{i.label}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing((prev) => ({ ...prev, isActive: e.target.checked }))} />
                Active
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-wine disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save Item'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
