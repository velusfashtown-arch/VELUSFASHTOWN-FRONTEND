import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { useAdminWebsite } from '../../../../context/AdminWebsiteContext';
import AdminInput from '../../Common/Form/Input';
import AdminCheckbox from '../../Common/Form/Checkbox';
import FormField from '../../Common/Form/FormField';
import { adminBtnPrimary, adminToast } from '../../Common/buttonClasses';
import NoWebsiteSelected from './NoWebsiteSelected';
import PageHeader from '../../Common/PageHeader';

function IntegrationsPageIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>;
}

const emptyIntegrations = {
  email: { enabled: false, toEmail: '' },
  webhook: { enabled: false, url: '' },
};

export default function Integrations() {
  const token = getToken();
  const { selectedWebsiteId } = useAdminWebsite();
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [values, setValues] = useState(emptyIntegrations);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadForms = useCallback(() => {
    if (!selectedWebsiteId) return;
    api.adminListForms(token, selectedWebsiteId).then((res) => {
      const list = res?.data || [];
      setForms(list);
      if (list.length && !selectedFormId) setSelectedFormId(list[0].id || list[0]._id);
    }).catch(() => setForms([]));
    // eslint-disable-next-line
  }, [token, selectedWebsiteId]);

  useEffect(() => { loadForms(); }, [loadForms]);

  useEffect(() => {
    const form = forms.find((f) => (f.id || f._id) === selectedFormId);
    setValues(form?.integrations ? {
      email: { enabled: form.integrations.email?.enabled || false, toEmail: form.integrations.email?.toEmail || '' },
      webhook: { enabled: form.integrations.webhook?.enabled || false, url: form.integrations.webhook?.url || '' },
    } : emptyIntegrations);
  }, [selectedFormId, forms]);

  function setEmail(key, val) {
    setValues((v) => ({ ...v, email: { ...v.email, [key]: val } }));
  }
  function setWebhook(key, val) {
    setValues((v) => ({ ...v, webhook: { ...v.webhook, [key]: val } }));
  }

  async function handleSave() {
    if (!selectedFormId) return;
    setSaving(true);
    setError('');
    try {
      await api.adminUpdateForm(token, selectedWebsiteId, selectedFormId, { integrations: values });
      setSuccess('Integrations saved!');
      setTimeout(() => setSuccess(''), 3000);
      loadForms();
    } catch (err) {
      setError(err.message || 'Failed to save integrations');
    } finally {
      setSaving(false);
    }
  }

  if (!selectedWebsiteId) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          icon={<IntegrationsPageIcon />}
          title="Integrations"
          description="Forward new submissions to an email address or a webhook URL."
        />
        <NoWebsiteSelected what="integrations" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<IntegrationsPageIcon />}
        title="Integrations"
        description="Forward new submissions to an email address or a webhook URL."
      />

      {success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {error && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{error}</div>}

      {forms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-16 text-center text-[13px] text-muted">
          No forms yet — create one in Form Builder first.
        </div>
      ) : (
        <div className="max-w-xl rounded-2xl border border-line bg-paper p-5">
          <div className="mb-5 max-w-xs">
            <FormField
              label="Form"
              type="select"
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              options={forms.map((f) => ({ value: f.id || f._id, label: f.name }))}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-line p-4">
              <AdminCheckbox
                label="Email notification"
                helper="Send a new email every time this form is submitted"
                checked={values.email.enabled}
                onChange={(e) => setEmail('enabled', e.target.checked)}
              />
              {values.email.enabled && (
                <div className="mt-3">
                  <AdminInput
                    label="Send to"
                    type="email"
                    placeholder="you@example.com"
                    value={values.email.toEmail}
                    onChange={(e) => setEmail('toEmail', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="rounded-lg border border-line p-4">
              <AdminCheckbox
                label="Webhook"
                helper="POST the submission as JSON to a URL (Zapier, Sheets, your own server, etc.)"
                checked={values.webhook.enabled}
                onChange={(e) => setWebhook('enabled', e.target.checked)}
              />
              {values.webhook.enabled && (
                <div className="mt-3">
                  <AdminInput
                    label="Webhook URL"
                    placeholder="https://..."
                    value={values.webhook.url}
                    onChange={(e) => setWebhook('url', e.target.value)}
                  />
                </div>
              )}
            </div>

            <button type="button" onClick={handleSave} disabled={saving} className={`self-start ${adminBtnPrimary}`}>
              {saving ? 'Saving...' : 'Save Integrations'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
