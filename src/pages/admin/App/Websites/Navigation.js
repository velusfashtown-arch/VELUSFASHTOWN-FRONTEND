// Websites/Navigation.js
// Navigation Builder — database-driven menu items for a website.
// Supports header/footer/mega menus, nested (parent) items, and types
// (Category / Collection / Product / Page / Custom URL).

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnPrimary, adminBtnSecondary } from '../../Common/buttonClasses';

const NAVIGATION_TYPES = [
  { value: 'CUSTOM_URL', label: 'Custom URL' },
  { value: 'CATEGORY', label: 'Category' },
  { value: 'COLLECTION', label: 'Collection' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'PAGE', label: 'Page' },
];

const LOCATIONS = ['header', 'footer', 'mobile', 'mega'];

const inputClass = 'w-full rounded-lg border border-[rgba(47,31,25,0.14)] bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';

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
      {error ? <div className="rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-3 text-sm text-[#b93b3b]">{error}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{items.length} menu item(s). Manage header, footer, mobile and mega menus.</p>
        <button type="button" onClick={openNew} className={adminBtnPrimary}>
          <span className="text-base leading-none">+</span> Add Menu Item
        </button>
      </div>

      {items.length === 0 && !editing ? (
        <div className="rounded-2xl border border-dashed border-[rgba(47,31,25,0.16)] bg-paper p-10 text-center text-sm text-muted">
          No menu items yet. Click "Add Menu Item" to build your navigation.
        </div>
      ) : null}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item._id} className={`rounded-xl border border-[rgba(47,31,25,0.08)] bg-paper p-3.5 shadow-[0_4px_16px_rgba(47,31,25,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(47,31,25,0.07)] ${!item.isActive ? 'opacity-60' : ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-terra/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terra">{item.type}</span>
                  <span className="rounded-full bg-[rgba(47,31,25,0.06)] px-2 py-0.5 text-[10px] font-bold uppercase text-muted">{locationName(navigations.find((n) => n._id === item.navigation)?.location)}</span>
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-ink">{item.label || 'Untitled'}</p>
                {item.url ? <p className="truncate text-[11px] text-muted">{item.url}</p> : null}
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="rounded-md border border-[rgba(47,31,25,0.14)] p-1.5 text-xs text-muted transition-colors hover:bg-sand hover:text-ink disabled:opacity-40">↑</button>
                <button type="button" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1} className="rounded-md border border-[rgba(47,31,25,0.14)] p-1.5 text-xs text-muted transition-colors hover:bg-sand hover:text-ink disabled:opacity-40">↓</button>
                <button type="button" onClick={() => handleToggle(item)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:bg-sand hover:text-ink">{item.isActive ? 'Disable' : 'Enable'}</button>
                <button type="button" onClick={() => openEdit(item)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2.5 py-1.5 text-[11px] font-semibold text-terra transition-colors hover:border-terra/30 hover:bg-terra/10">Edit</button>
                <button type="button" onClick={() => handleDelete(item._id)} className="rounded-md border border-[#f3d4d4] px-2.5 py-1.5 text-[11px] font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-5 shadow-2xl animate-admin-slide-in sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-semibold text-ink">{isNew ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Label</label>
                <input className={inputClass} value={editing.label} onChange={(e) => setEditing((prev) => ({ ...prev, label: e.target.value }))} placeholder="e.g. Silk Sarees" />
              </div>

              <div>
                <label className={labelClass}>Menu Location</label>
                <select className={inputClass} value={editing.location || 'header'} onChange={(e) => setEditing((prev) => ({ ...prev, location: e.target.value }))}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{locationName(l)}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Type</label>
                <select className={inputClass} value={editing.type} onChange={(e) => setEditing((prev) => ({ ...prev, type: e.target.value }))}>
                  {NAVIGATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              {editing.type === 'CUSTOM_URL' ? (
                <div>
                  <label className={labelClass}>URL</label>
                  <input className={inputClass} value={editing.url || ''} onChange={(e) => setEditing((prev) => ({ ...prev, url: e.target.value }))} placeholder="/shop" />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Target ID</label>
                  <input className={inputClass} value={editing.targetId || ''} onChange={(e) => setEditing((prev) => ({ ...prev, targetId: e.target.value || null }))} placeholder={`${editing.type} ID`} />
                </div>
              )}

              <div>
                <label className={labelClass}>Parent (for nested / mega menu)</label>
                <select className={inputClass} value={editing.parent || ''} onChange={(e) => setEditing((prev) => ({ ...prev, parent: e.target.value || null }))}>
                  <option value="">None (top-level)</option>
                  {items.filter((i) => i.type === 'CUSTOM_URL' || true).map((i) => <option key={i._id} value={i._id}>{i.label}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing((prev) => ({ ...prev, isActive: e.target.checked }))} className="h-4 w-4 accent-terra" />
                Active
              </label>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setEditing(null)} className={adminBtnSecondary}>Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className={adminBtnPrimary}>
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
