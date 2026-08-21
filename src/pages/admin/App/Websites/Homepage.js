// Websites/Homepage.js
// Homepage Builder — database-driven homepage sections for a website.
// Admin can add, edit, delete, duplicate, enable/disable and reorder
// sections. All persisted to MongoDB via the website content API.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnPrimary, adminBtnSecondary } from '../../Common/buttonClasses';

const SECTION_TYPES = [
  { value: 'AnnouncementBar', label: 'Announcement Bar' },
  { value: 'Hero', label: 'Hero Banner' },
  { value: 'Banner', label: 'Banner' },
  { value: 'CategoryGrid', label: 'Category Grid' },
  { value: 'CollectionGrid', label: 'Collection Grid' },
  { value: 'ProductCarousel', label: 'Product Carousel' },
  { value: 'ProductGrid', label: 'Product Grid' },
  { value: 'ImageText', label: 'Image + Text' },
  { value: 'Video', label: 'Video' },
  { value: 'Lookbook', label: 'Lookbook' },
  { value: 'Testimonials', label: 'Testimonials' },
  { value: 'Newsletter', label: 'Newsletter' },
  { value: 'Instagram', label: 'Instagram' },
];

const inputClass = 'w-full rounded-lg border border-[rgba(47,31,25,0.14)] bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';

function emptySection(type) {
  return {
    type,
    title: '',
    settings: {},
    items: [],
    isActive: true,
  };
}

export default function HomepageBuilder() {
  const { id } = useParams();
  const token = getToken();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // section being edited (object)
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.adminListHomepageSections(token, id)
      .then((res) => setSections(res?.data || []))
      .catch((err) => setError(err.message || 'Failed to load sections'))
      .finally(() => setLoading(false));
  }, [token, id]);

  useEffect(() => { load(); }, [load]);

  function openNewSection() {
    setEditing(emptySection('Hero'));
    setIsNew(true);
  }

  function openEdit(section) {
    setEditing({ ...section, settings: section.settings || {}, items: section.items || [] });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        await api.adminCreateHomepageSection(token, id, editing);
      } else {
        await api.adminUpdateHomepageSection(token, id, editing._id, editing);
      }
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message || 'Failed to save section');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(sectionId) {
    if (!window.confirm('Delete this homepage section?')) return;
    try {
      await api.adminDeleteHomepageSection(token, id, sectionId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to delete section');
    }
  }

  async function handleDuplicate(sectionId) {
    try {
      await api.adminDuplicateHomepageSection(token, id, sectionId);
      load();
    } catch (err) {
      setError(err.message || 'Failed to duplicate section');
    }
  }

  async function handleToggle(section) {
    try {
      await api.adminUpdateHomepageSection(token, id, section._id, { isActive: !section.isActive });
      load();
    } catch (err) {
      setError(err.message || 'Failed to update section');
    }
  }

  async function handleMove(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    try {
      await api.adminReorderHomepageSections(token, id, next.map((s) => s._id));
    } catch (err) {
      load();
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading homepage sections…</div>;

  return (
    <div className="space-y-5">
      {error ? <div className="rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-3 text-sm text-[#b93b3b]">{error}</div> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{sections.length} section(s) — displayed in order on the homepage.</p>
        <button type="button" onClick={openNewSection} className={adminBtnPrimary}>
          <span className="text-base leading-none">+</span> Add Section
        </button>
      </div>

      {/* Section list */}
      {sections.length === 0 && !editing ? (
        <div className="rounded-2xl border border-dashed border-[rgba(47,31,25,0.16)] bg-paper p-10 text-center text-sm text-muted">
          No homepage sections yet. Click "Add Section" to build your homepage.
        </div>
      ) : null}

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section._id} className={`rounded-2xl border border-[rgba(47,31,25,0.08)] bg-paper p-4 shadow-[0_4px_16px_rgba(47,31,25,0.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(47,31,25,0.07)] ${!section.isActive ? 'opacity-60' : ''}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-terra/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terra">{section.type}</span>
                  {!section.isActive ? <span className="rounded-full bg-[rgba(47,31,25,0.06)] px-2 py-0.5 text-[10px] font-bold uppercase text-muted">Disabled</span> : null}
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-ink">{section.title || 'Untitled section'}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="rounded-md border border-[rgba(47,31,25,0.14)] p-1.5 text-xs text-muted transition-colors hover:bg-sand hover:text-ink disabled:opacity-40" title="Move up">↑</button>
                <button type="button" onClick={() => handleMove(index, 1)} disabled={index === sections.length - 1} className="rounded-md border border-[rgba(47,31,25,0.14)] p-1.5 text-xs text-muted transition-colors hover:bg-sand hover:text-ink disabled:opacity-40" title="Move down">↓</button>
                <button type="button" onClick={() => handleToggle(section)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:bg-sand hover:text-ink" title={section.isActive ? 'Disable' : 'Enable'}>
                  {section.isActive ? 'Disable' : 'Enable'}
                </button>
                <button type="button" onClick={() => handleDuplicate(section._id)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2.5 py-1.5 text-[11px] font-semibold text-muted transition-colors hover:bg-sand hover:text-ink">Duplicate</button>
                <button type="button" onClick={() => openEdit(section)} className="rounded-md border border-[rgba(47,31,25,0.14)] px-2.5 py-1.5 text-[11px] font-semibold text-terra transition-colors hover:border-terra/30 hover:bg-terra/10">Edit</button>
                <button type="button" onClick={() => handleDelete(section._id)} className="rounded-md border border-[#f3d4d4] px-2.5 py-1.5 text-[11px] font-semibold text-[#b93b3b] transition-colors hover:bg-[#fce8e6]">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-5 shadow-2xl animate-admin-slide-in sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-playfair text-lg font-semibold text-ink">{isNew ? 'Add Section' : 'Edit Section'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-sand hover:text-ink">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Section Type</label>
                <select
                  className={inputClass + ' disabled:cursor-not-allowed disabled:opacity-60'}
                  value={editing.type}
                  onChange={(e) => setEditing((prev) => ({ ...prev, type: e.target.value }))}
                  disabled={!isNew}
                >
                  {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={editing.title || ''} onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))} placeholder="Section title" />
              </div>

              <div>
                <label className={labelClass}>Settings (JSON)</label>
                <textarea
                  className={inputClass + ' min-h-[120px] resize-y font-mono text-xs'}
                  value={JSON.stringify(editing.settings || {}, null, 2)}
                  onChange={(e) => {
                    try { setEditing((prev) => ({ ...prev, settings: JSON.parse(e.target.value) })); } catch { /* ignore invalid JSON while typing */ }
                  }}
                />
                <p className="mt-1 text-[11px] text-muted">e.g. {"{ \"heading\": \"New Arrivals\", \"limit\": 8 }"}</p>
              </div>

              <div>
                <label className={labelClass}>Items (JSON array)</label>
                <textarea
                  className={inputClass + ' min-h-[120px] resize-y font-mono text-xs'}
                  value={JSON.stringify(editing.items || [], null, 2)}
                  onChange={(e) => {
                    try { setEditing((prev) => ({ ...prev, items: JSON.parse(e.target.value) })); } catch { /* ignore invalid JSON while typing */ }
                  }}
                />
                <p className="mt-1 text-[11px] text-muted">e.g. [{"{ \"image\": \"...\", \"link\": \"/shop\" }"}]</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing((prev) => ({ ...prev, isActive: e.target.checked }))} className="h-4 w-4 accent-terra" />
                Active
              </label>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setEditing(null)} className={adminBtnSecondary}>Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className={adminBtnPrimary}>
                  {saving ? 'Saving…' : 'Save Section'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
