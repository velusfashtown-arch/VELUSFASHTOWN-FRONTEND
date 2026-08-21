// Websites/Detail.js
// Website detail page with tabs for Settings, Theme, Homepage, Navigation,
// Banners, Domains and Products. Purchases a single entry point to manage
// every aspect of a website.

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnBack, adminBtnPrimary } from '../../Common/buttonClasses';
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
      default: return <SettingsPanel website={website} id={id} token={token} />;
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading website…</div>;
  if (error) return <div className="rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-4 text-sm text-[#b93b3b]">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          {website?.logo ? (
            <img src={website.logo} alt="" className="mt-0.5 h-11 w-11 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-terra/10 text-base font-bold uppercase text-terra">
              {(website?.brandName || website?.name || 'S').slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <Link to="/admin/websites" className={`${adminBtnBack} mb-2`}>
              <span aria-hidden="true">←</span> All Websites
            </Link>
            <h1 className="m-0 truncate font-playfair text-[24px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[28px]">
              {website?.brandName || website?.name || 'Website'}
            </h1>
            <p className="m-0 mt-1 text-[13px] text-muted">/{website?.slug}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">
          <Link to={`/store/${website?.slug}`} target="_blank" rel="noopener noreferrer" className={adminBtnPrimary}>
            Preview Storefront
          </Link>
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-1 border-b border-[rgba(47,31,25,0.1)]">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-xs font-semibold transition-colors ${tab === t.key ? 'border-b-2 border-terra text-terra' : 'border-b-2 border-transparent text-muted hover:text-ink'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>{renderTab()}</div>
    </div>
  );
}

function SettingsPanel({ website, id, token }) {
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
      await api.adminUpdateWebsite(token, id, {
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

  const inputClass = 'w-full rounded-lg border border-[rgba(47,31,25,0.14)] bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';
  const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';
  const cardClass = 'rounded-2xl border border-[rgba(47,31,25,0.08)] bg-paper p-5 shadow-[0_12px_32px_rgba(47,31,25,0.06)]';
  const sectionLabel = 'mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted';

  return (
    <div className="max-w-2xl space-y-5">
      {error ? <div className="rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-3 text-sm text-[#b93b3b]">{error}</div> : null}
      {saved ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">Settings saved successfully.</div> : null}

      <section className={cardClass}>
        <h3 className={sectionLabel}>Branding</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Name</label><input className={inputClass} value={form.name} onChange={(e) => setField('name', e.target.value)} /></div>
          <div><label className={labelClass}>Brand Name</label><input className={inputClass} value={form.brandName} onChange={(e) => setField('brandName', e.target.value)} /></div>
          <div><label className={labelClass}>Slug</label><input className={inputClass} value={form.slug} onChange={(e) => setField('slug', e.target.value)} /></div>
          <div><label className={labelClass}>Domain</label><input className={inputClass} value={form.domain} onChange={(e) => setField('domain', e.target.value)} /></div>
          <div><label className={labelClass}>Logo URL</label><input className={inputClass} value={form.logo} onChange={(e) => setField('logo', e.target.value)} /></div>
          <div><label className={labelClass}>Favicon URL</label><input className={inputClass} value={form.favicon} onChange={(e) => setField('favicon', e.target.value)} /></div>
          <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea className={inputClass + ' min-h-[70px] resize-y'} value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className={sectionLabel}>Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Contact Email</label><input className={inputClass} value={form.contactEmail} onChange={(e) => setField('contactEmail', e.target.value)} /></div>
          <div><label className={labelClass}>Contact Phone</label><input className={inputClass} value={form.contactPhone} onChange={(e) => setField('contactPhone', e.target.value)} /></div>
          <div><label className={labelClass}>WhatsApp</label><input className={inputClass} value={form.whatsapp} onChange={(e) => setField('whatsapp', e.target.value)} /></div>
          <div><label className={labelClass}>Address</label><input className={inputClass} value={form.address} onChange={(e) => setField('address', e.target.value)} /></div>
        </div>
      </section>

      <section className={cardClass}>
        <h3 className={sectionLabel}>Social Links</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className={labelClass}>Instagram</label><input className={inputClass} value={form.instagram} onChange={(e) => setField('instagram', e.target.value)} /></div>
          <div><label className={labelClass}>Facebook</label><input className={inputClass} value={form.facebook} onChange={(e) => setField('facebook', e.target.value)} /></div>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={saving} className={adminBtnPrimary}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
