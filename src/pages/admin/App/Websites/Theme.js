// Websites/Theme.js
// Website Theme editor — primary/secondary/accent/background/text/border
// colors, heading/body fonts, button style, border radius, container width.
// Changes are saved to the backend Website.theme and shown in a live preview.

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';

const DEFAULT_THEME = {
  primaryColor: '#a74e3e',
  secondaryColor: '#241b18',
  accentColor: '#f3c997',
  backgroundColor: '#fff9f1',
  textColor: '#241b18',
  borderColor: '#e8ddd2',
  headingFont: 'Playfair Display',
  bodyFont: 'Inter',
  buttonStyle: 'rounded-full',
  borderRadius: '16px',
  containerWidth: '1280px',
};

const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-12 cursor-pointer border-0 bg-transparent p-0" />
      </div>
      <div className="min-w-0 flex-1">
        <label className="mb-0.5 block text-[11px] font-semibold text-ink">{label}</label>
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

export default function WebsiteTheme() {
  const { id } = useParams();
  const token = getToken();
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .adminGetWebsite(token, id)
      .then((res) => {
        const data = res?.data || res?.website || {};
        setTheme({ ...DEFAULT_THEME, ...(data.theme || {}) });
      })
.catch((err) => setError(err.message || 'Failed to load theme'))
      .finally(() => setLoading(false));
  }, [id, token]);

  function setField(key, value) {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.adminUpdateWebsite(token, id, { theme });
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading theme…</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Editor */}
      <div className="space-y-5">
        {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <section className="rounded-xl border border-line bg-paper p-5">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Colors</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField label="Primary Color" value={theme.primaryColor} onChange={(v) => setField('primaryColor', v)} />
            <ColorField label="Secondary Color" value={theme.secondaryColor} onChange={(v) => setField('secondaryColor', v)} />
            <ColorField label="Accent Color" value={theme.accentColor} onChange={(v) => setField('accentColor', v)} />
            <ColorField label="Background Color" value={theme.backgroundColor} onChange={(v) => setField('backgroundColor', v)} />
            <ColorField label="Text Color" value={theme.textColor} onChange={(v) => setField('textColor', v)} />
            <ColorField label="Border Color" value={theme.borderColor} onChange={(v) => setField('borderColor', v)} />
          </div>
        </section>

        <section className="rounded-xl border border-line bg-paper p-5">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Typography</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-1 block text-xs font-semibold text-ink">Heading Font</label><input className={inputClass} value={theme.headingFont} onChange={(e) => setField('headingFont', e.target.value)} placeholder="Playfair Display" /></div>
            <div><label className="mb-1 block text-xs font-semibold text-ink">Body Font</label><input className={inputClass} value={theme.bodyFont} onChange={(e) => setField('bodyFont', e.target.value)} placeholder="Inter" /></div>
          </div>
        </section>

        <section className="rounded-xl border border-line bg-paper p-5">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Layout & Buttons</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink">Button Style</label>
              <select className={inputClass} value={theme.buttonStyle} onChange={(e) => setField('buttonStyle', e.target.value)}>
                <option value="rounded-full">Pill (rounded-full)</option>
                <option value="rounded-lg">Rounded (rounded-lg)</option>
                <option value="rounded-md">Soft (rounded-md)</option>
                <option value="rounded-none">Square</option>
              </select>
            </div>
            <div><label className="mb-1 block text-xs font-semibold text-ink">Border Radius</label><input className={inputClass} value={theme.borderRadius} onChange={(e) => setField('borderRadius', e.target.value)} placeholder="16px" /></div>
            <div><label className="mb-1 block text-xs font-semibold text-ink">Container Width</label><input className={inputClass} value={theme.containerWidth} onChange={(e) => setField('containerWidth', e.target.value)} placeholder="1280px" /></div>
          </div>
        </section>

        {saved ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Theme saved successfully.</div> : null}

        <div className="flex justify-end">
          <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-terra px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-wine disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Theme'}
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Live Preview</h3>
        <div
          className="overflow-hidden rounded-xl border shadow-sm"
          style={{ backgroundColor: theme.backgroundColor, borderColor: theme.borderColor, borderRadius: theme.borderRadius, ['--t-primary']: theme.primaryColor, ['--t-secondary']: theme.secondaryColor, ['--t-accent']: theme.accentColor, ['--t-text']: theme.textColor, ['--t-border']: theme.borderColor }}
        >
          <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: theme.borderColor }}>
            <span className="font-bold" style={{ color: theme.textColor, fontFamily: theme.headingFont }}>Brand</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: theme.primaryColor }}>Shop · About · Contact</span>
          </div>
          <div className="px-5 py-8">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accentColor }}>New Collection</p>
            <h2 className="text-3xl" style={{ color: theme.textColor, fontFamily: theme.headingFont }}>Elegant Sarees</h2>
            <p className="mt-2 text-sm" style={{ color: theme.textColor, fontFamily: theme.bodyFont }}>A preview of how your website will look with these theme settings.</p>
            <button
              type="button"
              className="mt-4 px-5 py-2.5 text-xs font-bold text-white"
              style={{ backgroundColor: theme.primaryColor, borderRadius: theme.buttonStyle === 'rounded-full' ? '9999px' : theme.buttonStyle === 'rounded-lg' ? '8px' : theme.buttonStyle === 'rounded-md' ? '6px' : '0px' }}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
