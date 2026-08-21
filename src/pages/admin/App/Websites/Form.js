// Websites/Form.js
// Create or edit a Website. Fields mapped to the Website model:
//   name, brandName, slug, domain, description, logo, favicon,
//   contact { contactEmail, contactPhone, whatsapp, address },
//   socialLinks { instagram, facebook, youtube, twitter, pinterest },
//   status.

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { adminBtnPrimary, adminBtnSecondary } from '../../Common/buttonClasses';

const EMPTY = {
  name: '',
  brandName: '',
  slug: '',
  domain: '',
  description: '',
  logo: '',
  favicon: '',
  status: 'active',
  contact: { contactEmail: '', contactPhone: '', whatsapp: '', address: '' },
  socialLinks: { instagram: '', facebook: '', youtube: '', twitter: '', pinterest: '' },
};

const inputClass = 'w-full rounded-lg border border-[rgba(47,31,25,0.14)] bg-paper px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-terra';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ink';
const cardClass = 'rounded-2xl border border-[rgba(47,31,25,0.08)] bg-paper p-4 shadow-[0_12px_32px_rgba(47,31,25,0.06)] sm:p-5';
const sectionLabel = 'mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-muted';

export default function WebsiteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    api
      .adminGetWebsite(token, id)
      .then((res) => {
        const data = res?.data || res?.website || {};
        setForm({
          name: data.name || '',
          brandName: data.brandName || '',
          slug: data.slug || '',
          domain: data.domain || '',
          description: data.description || '',
          logo: data.logo || '',
          favicon: data.favicon || '',
          status: data.status || 'active',
          contact: { ...EMPTY.contact, ...(data.contact || {}) },
          socialLinks: { ...EMPTY.socialLinks, ...(data.socialLinks || {}) },
        });
      })
      .catch((err) => setError(err.message || 'Failed to load website'))
      .finally(() => setLoading(false));
  }, [isEdit, id, token]);

  function set(path, value) {
    setForm((prev) => {
      const keys = path.split('.');
      const next = { ...prev };
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...(ref[keys[i]] || {}) };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        brandName: form.brandName,
        slug: form.slug,
        domain: form.domain,
        description: form.description,
        logo: form.logo,
        favicon: form.favicon,
        status: form.status,
        contact: form.contact,
        socialLinks: form.socialLinks,
      };
      if (isEdit) {
        await api.adminUpdateWebsite(token, id, payload);
      } else {
        await api.adminCreateWebsite(token, payload);
      }
      navigate('/admin/websites');
    } catch (err) {
      setError(err.message || 'Failed to save website');
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse text-sm text-muted">Loading website…</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="m-0 font-playfair text-[24px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[28px]">
        {isEdit ? 'Edit Website' : 'Create Website'}
      </h1>
      <p className="m-0 mb-6 mt-1.5 text-[13px] leading-relaxed text-muted">
        {isEdit ? 'Update the website configuration and settings.' : 'Set up a new storefront. You can configure branding, theme, homepage, and navigation after creation.'}
      </p>

      {error ? <div className="mb-4 rounded-xl border border-[#f3d4d4] bg-[#fce8e6] p-3 text-sm text-[#b93b3b]">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic */}
        <section className={cardClass}>
          <h3 className={sectionLabel}>Basic Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Website Name *</label>
              <input className={inputClass} value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="VELU'S FASHTOWN" />
            </div>
            <div>
              <label className={labelClass}>Brand Name</label>
              <input className={inputClass} value={form.brandName} onChange={(e) => set('brandName', e.target.value)} placeholder="Store brand" />
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <input className={inputClass + ' disabled:cursor-not-allowed disabled:opacity-60'} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="velus-fashtown" disabled={isEdit} />
            </div>
            <div>
              <label className={labelClass}>Primary Domain</label>
              <input className={inputClass} value={form.domain} onChange={(e) => set('domain', e.target.value)} placeholder="velusfashtown.com" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea className={inputClass + ' min-h-[70px] resize-y'} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Store description" />
            </div>
            <div>
              <label className={labelClass}>Logo URL</label>
              <input className={inputClass} value={form.logo} onChange={(e) => set('logo', e.target.value)} placeholder="https://…/logo.png" />
            </div>
            <div>
              <label className={labelClass}>Favicon URL</label>
              <input className={inputClass} value={form.favicon} onChange={(e) => set('favicon', e.target.value)} placeholder="https://…/favicon.png" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={cardClass}>
          <h3 className={sectionLabel}>Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Email</label><input className={inputClass} value={form.contact.contactEmail} onChange={(e) => set('contact.contactEmail', e.target.value)} /></div>
            <div><label className={labelClass}>Phone</label><input className={inputClass} value={form.contact.contactPhone} onChange={(e) => set('contact.contactPhone', e.target.value)} /></div>
            <div><label className={labelClass}>WhatsApp</label><input className={inputClass} value={form.contact.whatsapp} onChange={(e) => set('contact.whatsapp', e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={labelClass}>Address</label><textarea className={inputClass + ' min-h-[60px] resize-y'} rows={2} value={form.contact.address} onChange={(e) => set('contact.address', e.target.value)} /></div>
          </div>
        </section>

        {/* Social */}
        <section className={cardClass}>
          <h3 className={sectionLabel}>Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Instagram</label><input className={inputClass} value={form.socialLinks.instagram} onChange={(e) => set('socialLinks.instagram', e.target.value)} /></div>
            <div><label className={labelClass}>Facebook</label><input className={inputClass} value={form.socialLinks.facebook} onChange={(e) => set('socialLinks.facebook', e.target.value)} /></div>
            <div><label className={labelClass}>YouTube</label><input className={inputClass} value={form.socialLinks.youtube} onChange={(e) => set('socialLinks.youtube', e.target.value)} /></div>
            <div><label className={labelClass}>Twitter</label><input className={inputClass} value={form.socialLinks.twitter} onChange={(e) => set('socialLinks.twitter', e.target.value)} /></div>
            <div><label className={labelClass}>Pinterest</label><input className={inputClass} value={form.socialLinks.pinterest} onChange={(e) => set('socialLinks.pinterest', e.target.value)} /></div>
          </div>
        </section>

        <div className="flex flex-col-reverse items-stretch justify-end gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <button type="button" onClick={() => navigate('/admin/websites')} className={adminBtnSecondary}>Cancel</button>
          <button type="submit" disabled={saving} className={adminBtnPrimary}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Website'}
          </button>
        </div>
      </form>
    </div>
  );
}
