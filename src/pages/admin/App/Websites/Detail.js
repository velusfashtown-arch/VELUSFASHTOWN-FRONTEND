// Websites/Detail.js
// Website detail page with tabs for Settings, Theme, Homepage, Navigation,
// Banners, Domains and Products. Purchases a single entry point to manage
// every aspect of a website.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import WebsiteTheme from './Theme';
import HomepageBuilder from './Homepage';
import NavigationBuilder from './Navigation';
import Banners from './Banners';
import WebsiteProducts from './Products';
import Domains from './Domains';

const TABS = [
  { key: 'settings', label: 'Settings' },
  { key: 'theme', label: 'Theme' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'banners', label: 'Banners' },
  { key: 'domains', label: 'Domains' },
  { key: 'products', label: 'Products' },
];

export default function WebsiteDetail() {
  const { id } = useParams();
  const token = getToken();
  const [tab, setTab] = useState('settings');
  const [website, setWebsite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    api.adminGetWebsite(token, id)
      .then((res) => setWebsite(res?.data || res?.website || null))
      .catch((err) => setError(err.message || 'Failed to load website'))
      .finally(() => setLoading(false));
  }, [id, token]);

  function renderTab() {
    switch (tab) {
      case 'theme': return <WebsiteTheme />;
      case 'homepage': return <HomepageBuilder />;
      case 'navigation': return <NavigationBuilder />;
      case 'banners': return <Banners />;
      case 'domains': return <Domains />;
      case 'products': return <WebsiteProducts />;
      default: return <SettingsPanel website={website} />;
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading website…</div>;
  if (error) return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="m-0 font-playfair text-xl font-semibold text-ink">{website?.brandName || website?.name || 'Website'}</h2>
          <p className="mt-1 text-xs text-muted">/{website?.slug}</p>
        </div>
        <Link to={`/store/${website?.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-muted no-underline hover:bg-cream">
          Preview Storefront
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-t-lg px-4 py-2 text-xs font-semibold transition-colors ${tab === t.key ? 'border-b-2 border-terra bg-paper text-terra' : 'text-muted hover:text-ink'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>{renderTab()}</div>
    </div>
  );
}

function SettingsPanel({ website }) {
  const token = getToken();
  const [form, setForm] = useState(() => ({
    name: website?.name || '',
    brandName: website?.brandName || '',
    slug: website?.slug || '',
    description: website?.description || '',
    domain: website?.domain || '',
    logo: website?.logo || '',
    favicon: website?.favicon || '',
    status: website?.status || 'active',
    contactEmail: website?.contact?.contactEmail || '',
    contactPhone: website?.contact?.contactPhone || '',
    whatsapp: website?.contact?.whatsapp || '',
    address: website?.contact?.address || '',
    instagram: website?.socialLinks?.instagram || '',
    facebook: website?.socialLinks?.facebook || '',
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api.adminUpdateWebsite(token, website._id, {
        name: form.name,
        brandName: form.brandName,
        slug: form.slug,
        description: form.description,
        domain: form.domain,
        logo: form.logo,
        favicon: form.favicon,
        status: form.status,
        contact: { contactEmail: form.contactEmail, contactPhone: form.contactPhone, whatsapp: form.whatsapp, address: form.address },
        socialLinks: { instagram: form.instagram, facebook: form.facebook },
      });
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  const inputClass = 'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-terra';

  return (
    <div className="max-w-2xl space-y-5">
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
      {saved ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Settings saved successfully.</div> : null}

      <section className="rounded-xl border border-line bg-paper p-5">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Branding</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs font-semibold text-ink">Name</label><input className={inputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Brand Name</label><input className={inputClass} value={form.brandName} onChange={(e) => setField('brandName', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Slug</label><input className={inputClass} value={form.slug} onChange={(e) => setField('slug', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Domain</label><input className={inputClass} value={form.domain} onChange={(e) => setField('domain', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Logo URL</label><input className={inputClass} value={form.logo} onChange={(e) => setField('logo', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Favicon URL</label><input className={inputClass} value={form.favicon} onChange={(e) => setField('favicon', e.target.value)} /></div>
          <div className="sm:col-span-2"><label className="mb-1 block text-xs font-semibold text-ink">Description</label><textarea className={inputClass + ' min-h-[60px]'} value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink">Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs font-semibold text-ink">Contact Email</label><input className={inputClass} value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Contact Phone</label><input className={inputClass} value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">WhatsApp</label><input className={inputClass} value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Address</label><input className={inputClass} value={form.address} onChange={(e) => setField('address', e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-paper p-5">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Social Links</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1 block text-xs font-semibold text-ink">Instagram</label><input className={inputClass} value={form.instagram} onChange={(e) => setField('instagram', e.target.value)} /></div>
          <div><label className="mb-1 block text-xs font-semibold text-ink">Facebook</label><input className={inputClass} value={form.facebook} onChange={(e) => setField('facebook', e.target.value)} /></div>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-terra px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-wine disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
