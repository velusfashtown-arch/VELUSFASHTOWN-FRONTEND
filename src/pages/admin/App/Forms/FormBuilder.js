import React, { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import { useAdminWebsite } from '../../../../context/AdminWebsiteContext';
import AdminModal from '../../Common/Modal';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import AdminTable from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import AdminInput from '../../Common/Form/Input';
import AdminTextarea from '../../Common/Form/Textarea';
import AdminCheckbox from '../../Common/Form/Checkbox';
import FormField from '../../Common/Form/FormField';
import { adminBtnPrimary, adminBtnSecondary, adminToast } from '../../Common/buttonClasses';
import NoWebsiteSelected from './NoWebsiteSelected';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
];

const CHOICE_TYPES = ['dropdown', 'radio'];

// Fallback shown until /forms/types responds — keeps the dropdown usable
// even if that request is slow or fails.
const FALLBACK_FORM_TYPES = [
  { value: 'general', label: 'General / Custom' },
  { value: 'contact_us', label: 'Contact Us' },
  { value: 'product_inquiry', label: 'Product Inquiry' },
  { value: 'category_request', label: 'Category Request' },
];

function typeLabel(type) {
  return FALLBACK_FORM_TYPES.find((t) => t.value === type)?.label || type || 'General / Custom';
}

function emptyField() {
  return { label: '', fieldType: 'text', required: false, placeholder: '', options: [] };
}

function FieldRow({ field, onChange, onRemove }) {
  const isChoice = CHOICE_TYPES.includes(field.fieldType);

  function set(key, value) {
    onChange({ ...field, [key]: value });
  }

  function setOptionsText(text) {
    const options = text.split(',').map((s) => s.trim()).filter(Boolean).map((v) => ({ value: v, label: v }));
    set('options', options);
  }

  return (
    <div className="rounded-lg border border-line bg-[rgba(47,31,25,0.02)] p-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[2fr_1.2fr_auto]">
        <AdminInput placeholder="Field label, e.g. Your Name" value={field.label} onChange={(e) => set('label', e.target.value)} />
        <FormField type="select" value={field.fieldType} onChange={(e) => set('fieldType', e.target.value)} options={FIELD_TYPES} />
        <button type="button" onClick={onRemove} className="shrink-0 rounded-md border border-line px-3 py-2 text-[11px] text-muted hover:border-[#c5221f]/30 hover:text-[#c5221f]">
          Remove
        </button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <AdminInput placeholder="Placeholder (optional)" value={field.placeholder} onChange={(e) => set('placeholder', e.target.value)} />
        <label className="flex items-center gap-2 text-[12px] text-ink">
          <input type="checkbox" checked={field.required} onChange={(e) => set('required', e.target.checked)} className="h-4 w-4 accent-terra" />
          Required
        </label>
      </div>
      {isChoice && (
        <div className="mt-2">
          <AdminInput
            placeholder="Options, comma separated — e.g. General, Support, Sales"
            value={(field.options || []).map((o) => o.value).join(', ')}
            onChange={(e) => setOptionsText(e.target.value)}
            helper="comma-separated list"
          />
        </div>
      )}
    </div>
  );
}

function FormModal({ form, onClose, onSaved }) {
  const token = getToken();
  const { selectedWebsiteId } = useAdminWebsite();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    name: form?.name || '',
    type: form?.type || 'general',
    title: form?.title || '',
    description: form?.description || '',
    submitButtonText: form?.submitButtonText || 'Submit',
    successMessage: form?.successMessage || "Thank you! We'll be in touch soon.",
    isActive: form?.isActive !== false,
  });
  const [fields, setFields] = useState(form?.fields?.length ? form.fields : [emptyField()]);
  const [formTypes, setFormTypes] = useState(FALLBACK_FORM_TYPES);

  useEffect(() => {
    api.adminListFormTypes(token).then((res) => {
      if (res?.data?.length) setFormTypes(res.data);
    }).catch(() => {});
    // eslint-disable-next-line
  }, []);

  function set(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function updateField(index, next) {
    setFields((f) => f.map((field, i) => (i === index ? next : field)));
  }

  function addField() {
    setFields((f) => [...f, emptyField()]);
  }

  function removeField(index) {
    setFields((f) => f.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!values.name.trim()) return setError('Form name is required');
    const cleanFields = fields.filter((f) => f.label.trim());
    if (cleanFields.length === 0) return setError('Add at least one field');

    setLoading(true);
    setError('');
    try {
      const payload = { ...values, fields: cleanFields };
      if (form?.id || form?._id) {
        await api.adminUpdateForm(token, selectedWebsiteId, form.id || form._id, payload);
      } else {
        await api.adminCreateForm(token, selectedWebsiteId, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save form');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title={form ? 'Edit Form' : 'New Form'}
      size="xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="submit" form="form-builder-form" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Save Form'}</button>
          <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="form-builder-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="m-0 text-[12px] font-medium text-[#c5221f]">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Form Name (internal)" placeholder="e.g. Contact Us" value={values.name} onChange={(e) => set('name', e.target.value)} required />
          <FormField label="Form Type" type="select" value={values.type} onChange={(e) => set('type', e.target.value)} options={formTypes} helper="What is this form for? Just a label — doesn't change behavior." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Title (shown to visitors)" placeholder="e.g. Get in touch" value={values.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <AdminTextarea label="Description" placeholder="Shown under the title" value={values.description} onChange={(e) => set('description', e.target.value)} />

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Fields</label>
            <button type="button" onClick={addField} className="text-[11px] font-semibold text-terra hover:text-wine">+ Add field</button>
          </div>
          <div className="flex flex-col gap-2">
            {fields.map((field, i) => (
              <FieldRow key={i} field={field} onChange={(next) => updateField(i, next)} onRemove={() => removeField(i)} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Submit Button Text" value={values.submitButtonText} onChange={(e) => set('submitButtonText', e.target.value)} />
          <AdminInput label="Success Message" value={values.successMessage} onChange={(e) => set('successMessage', e.target.value)} />
        </div>

        <AdminCheckbox label="Active" helper="Inactive forms can't be viewed or submitted on the storefront" checked={values.isActive} onChange={(e) => set('isActive', e.target.checked)} />
      </form>
    </AdminModal>
  );
}

export default function FormBuilder() {
  const token = getToken();
  const { selectedWebsiteId } = useAdminWebsite();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [formToDelete, setFormToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    rows, loading, refreshing, error,
    refresh: loadForms,
  } = useTableData({
    fetcher: async () => {
      if (!selectedWebsiteId) return { data: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 1 } };
      const res = await api.adminListForms(token, selectedWebsiteId);
      const data = res?.data || [];
      return { data, pagination: { page: 1, limit: data.length || 10, total: data.length, totalPages: 1 } };
    },
  });

  // useTableData only fetches once on mount — refetch whenever the admin
  // switches websites via the header switcher (selectedWebsiteId starts
  // null on first load, so this also covers picking a website for the
  // first time).
  useEffect(() => { loadForms(); }, [selectedWebsiteId]); // eslint-disable-line

  async function handleDelete() {
    if (!formToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteForm(token, selectedWebsiteId, formToDelete.id || formToDelete._id);
      await loadForms();
      setFormToDelete(null);
      showSuccess('Form deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete form');
    } finally {
      setDeleting(false);
    }
  }

  function showSuccess(msg) { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  function showError(msg) { setLocalError(msg); setTimeout(() => setLocalError(''), 3000); }
  function openAdd() { setEditingForm(null); setModalOpen(true); }
  function openEdit(f) { setEditingForm(f); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingForm(null); }

  if (!selectedWebsiteId) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="m-0 text-lg font-semibold text-ink">Form Builder</h2>
          <p className="m-0 mt-1 text-[13px] text-muted">Build customer-facing forms — Contact Us, inquiries, newsletter signup — for your storefront.</p>
        </div>
        <NoWebsiteSelected what="forms" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-lg font-semibold text-ink">Form Builder</h2>
        <p className="m-0 mt-1 text-[13px] text-muted">Build customer-facing forms — Contact Us, inquiries, newsletter signup — for your storefront.</p>
      </div>

      {success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{error || localError}</div>}

      {modalOpen && (
        <FormModal
          form={editingForm}
          onClose={closeModal}
          onSaved={() => { loadForms(); showSuccess(editingForm ? 'Form updated!' : 'Form created!'); }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(formToDelete)}
        onClose={() => setFormToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={formToDelete?.name ? `"${formToDelete.name}"` : 'this form'}
      />

      <AdminTable
        title="Forms"
        searchable={false}
        onAdd={openAdd}
        addLabel="New Form"
        onRefresh={loadForms}
        loading={loading}
        refreshing={refreshing}
        columns={[
          {
            key: 'name',
            header: 'Form',
            render: (f) => (
              <div>
                <b className="text-ink">{f.name}</b>
                <small className="block text-[11px] text-muted">/{f.slug} · {f.fields?.length || 0} field{f.fields?.length === 1 ? '' : 's'}</small>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (f) => (
              <span className="inline-flex rounded-full bg-[rgba(167,78,62,0.1)] px-2 py-0.5 text-[10px] font-semibold text-terra">{typeLabel(f.type)}</span>
            ),
          },
          { key: 'submissionCount', header: 'Submissions', render: (f) => <span className="text-[12px] text-ink">{f.submissionCount || 0}</span> },
          {
            key: 'isActive',
            header: 'Status',
            render: (f) => (
              <span className={`text-[11px] font-semibold ${f.isActive ? 'text-[#137333]' : 'text-muted'}`}>{f.isActive ? 'Active' : 'Inactive'}</span>
            ),
          },
        ]}
        rows={rows}
        rowKey="id"
        rowActions={[
          { label: 'Edit', onClick: openEdit },
          { label: 'Delete', danger: true, onClick: setFormToDelete },
        ]}
        emptyMessage="No forms yet. Click New Form to create one."
      />
    </div>
  );
}
