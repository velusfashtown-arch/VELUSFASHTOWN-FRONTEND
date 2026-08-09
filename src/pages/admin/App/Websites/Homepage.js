// Websites/Homepage.js
// Homepage Builder — database-driven homepage sections for a website.
// Admin can add, edit, delete, duplicate, enable/disable and reorder
// sections. All persisted to MongoDB via the website content API.

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

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

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

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
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{sections.length} section(s) — displayed in order on the homepage.</p>
        <button type="button" onClick={openNewSection} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-wine">
          + Add Section
        </button>
      </div>

      {/* Section list */}
      {sections.length === 0 && !editing ? (
        <div className="rounded-xl border border-dashed border-line bg-paper p-10 text-center text-sm text-muted">
          No homepage sections yet. Click "Add Section" to build your homepage.
        </div>
      ) : null}

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section._id} className={`rounded-xl border border-line bg-paper p-4 ${!section.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terra">{section.type}</span>
                  {!section.isActive ? <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-muted">Disabled</span> : null}
                </div>
                <p className="mt-1 truncate text-sm font-semibold text-ink">{section.title || 'Untitled section'}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => handleMove(index, -1)} disabled={index === 0} className="rounded border border-line p-1.5 text-xs text-muted hover:bg-cream disabled:opacity-40" title="Move up">↑</button>
                <button type="button" onClick={() => handleMove(index, 1)} disabled={index === sections.length - 1} className="rounded border border-line p-1.5 text-xs text-muted hover:bg-cream disabled:opacity-40" title="Move down">↓</button>
                <button type="button" onClick={() => handleToggle(section)} className="rounded border border-line px-2 py-1.5 text-xs text-muted hover:bg-cream" title={section.isActive ? 'Disable' : 'Enable'}>
                  {section.isActive ? 'Disable' : 'Enable'}
                </button>
                <button type="button" onClick={() => handleDuplicate(section._id)} className="rounded border border-line px-2 py-1.5 text-xs text-muted hover:bg-cream">Duplicate</button>
                <button type="button" onClick={() => openEdit(section)} className="rounded border border-line px-2 py-1.5 text-xs font-semibold text-terra hover:bg-cream">Edit</button>
                <button type="button" onClick={() => handleDelete(section._id)} className="rounded border border-red-200 px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor drawer */}
      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setEditing(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-paper p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">{isNew ? 'Add Section' : 'Edit Section'}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-ink">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Section Type</label>
                <select
                  className={inputClass}
                  value={editing.type}
                  onChange={(e) => setEditing((prev) => ({ ...prev, type: e.target.value }))}
                  disabled={!isNew}
                >
                  {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Title</label>
                <input className={inputClass} value={editing.title || ''} onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))} placeholder="Section title" />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Settings (JSON)</label>
                <textarea
                  className={inputClass + ' min-h-[120px] font-mono text-xs'}
                  value={JSON.stringify(editing.settings || {}, null, 2)}
                  onChange={(e) => {
                    try { setEditing((prev) => ({ ...prev, settings: JSON.parse(e.target.value) })); } catch { /* ignore invalid JSON while typing */ }
                  }}
                />
                <p className="mt-1 text-[11px] text-muted">e.g. {"{ \"heading\": \"New Arrivals\", \"limit\": 8 }"}</p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Items (JSON array)</label>
                <textarea
                  className={inputClass + ' min-h-[120px] font-mono text-xs'}
                  value={JSON.stringify(editing.items || [], null, 2)}
                  onChange={(e) => {
                    try { setEditing((prev) => ({ ...prev, items: JSON.parse(e.target.value) })); } catch { /* ignore invalid JSON while typing */ }
                  }}
                />
                <p className="mt-1 text-[11px] text-muted">e.g. [{"{ \"image\": \"...\", \"link\": \"/shop\" }"}]</p>
              </div>

              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editing.isActive !== false} onChange={(e) => setEditing((prev) => ({ ...prev, isActive: e.target.checked }))} />
                Active
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted hover:bg-cream">Cancel</button>
                <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-terra px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-wine disabled:opacity-60">
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
