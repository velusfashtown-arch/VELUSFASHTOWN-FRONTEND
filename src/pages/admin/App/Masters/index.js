import React, { useEffect, useState } from 'react';
import { api } from '../../../../lib/api';
import { getToken } from '../../../../lib/auth';
import AdminModal from '../../Common/Modal';
import ConfirmDeleteModal from '../../Common/ConfirmDeleteModal';
import AdminTable from '../../Common/Table';
import useTableData from '../../Common/Table/useTableData';
import AdminInput from '../../Common/Form/Input';
import AdminCheckbox from '../../Common/Form/Checkbox';
import FormField from '../../Common/Form/FormField';
import { adminBtnPrimary, adminBtnSecondary, adminToast } from '../../Common/buttonClasses';

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox / Switch' },
  { value: 'radio', label: 'Radio' },
  { value: 'richtext', label: 'Rich Text Editor' },
  { value: 'image', label: 'Image Upload' },
];

const CHOICE_TYPES = ['dropdown', 'radio'];

function slugifyKey(label) {
  return label.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function MasterModal({ field, onClose, onSaved, groupOptions = [] }) {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    label: field?.label || '',
    fieldType: field?.fieldType || 'text',
    required: field?.required || false,
    placeholder: field?.placeholder || '',
    helpText: field?.helpText || '',
    options: field?.options?.length ? field.options : [{ value: '', label: '' }],
    group: field?.group || 'Custom Fields',
    multiple: field?.multiple || false,
    maxLength: field?.maxLength ?? '',
    min: field?.min ?? '',
    max: field?.max ?? '',
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setOption(index, key, value) {
    setForm((f) => {
      const options = [...f.options];
      options[index] = { ...options[index], [key]: value };
      return { ...f, options };
    });
  }

  function addOption() {
    setForm((f) => ({ ...f, options: [...f.options, { value: '', label: '' }] }));
  }

  function removeOption(index) {
    setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
  }

  const isChoiceType = CHOICE_TYPES.includes(form.fieldType);
  const isNumberType = form.fieldType === 'number';
  const isTextareaType = form.fieldType === 'textarea';
  const isImageType = form.fieldType === 'image';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.label.trim()) return setError('Label is required');
    if (isChoiceType && !form.options.some((o) => o.value.trim())) {
      return setError('Add at least one option');
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        label: form.label.trim(),
        fieldType: form.fieldType,
        required: form.required,
        placeholder: form.placeholder.trim(),
        helpText: form.helpText.trim(),
        group: form.group.trim() || 'Custom Fields',
      };
      if (isChoiceType) {
        payload.options = form.options.filter((o) => o.value.trim()).map((o) => ({ value: o.value.trim(), label: o.label.trim() || o.value.trim() }));
      }
      if (isImageType) {
        payload.multiple = form.multiple;
      }
      if (isTextareaType) {
        payload.maxLength = form.maxLength === '' ? null : Number(form.maxLength);
      }
      if (isNumberType) {
        payload.min = form.min === '' ? null : Number(form.min);
        payload.max = form.max === '' ? null : Number(form.max);
      }

      if (field?.id) {
        await api.adminUpdateMaster(token, field.id, payload);
      } else {
        await api.adminCreateMaster(token, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save field');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModal
      isOpen={true}
      onClose={onClose}
      title={field ? 'Edit Master Field' : 'Add Master Field'}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button type="submit" form="master-field-form" disabled={loading} className={adminBtnPrimary}>{loading ? 'Saving...' : 'Save Field'}</button>
          <button type="button" className={adminBtnSecondary} onClick={onClose}>Cancel</button>
        </div>
      }
    >
      <form id="master-field-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="m-0 text-[12px] font-medium text-[#c5221f]">{error}</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Label"
            placeholder="e.g. Cash on Delivery"
            value={form.label}
            onChange={(e) => set('label', e.target.value)}
            helper={!field ? `key: ${slugifyKey(form.label) || '—'}` : undefined}
            required
          />
          <FormField
            label="Field Type"
            type="select"
            value={form.fieldType}
            onChange={(e) => set('fieldType', e.target.value)}
            options={FIELD_TYPES}
            disabled={Boolean(field)}
            helper={field ? "can't change after creation" : undefined}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {form.fieldType !== 'checkbox' && form.fieldType !== 'image' && (
            <AdminInput
              label="Placeholder"
              placeholder="Shown inside the empty field"
              value={form.placeholder}
              onChange={(e) => set('placeholder', e.target.value)}
            />
          )}
          <AdminInput
            label="Section"
            placeholder="e.g. Pricing, Images, Custom Fields"
            value={form.group}
            onChange={(e) => set('group', e.target.value)}
            helper="which part of Add Product this appears under"
            list="master-group-options"
          />
          <datalist id="master-group-options">
            {groupOptions.map((name) => <option key={name} value={name} />)}
          </datalist>
        </div>

        <AdminInput
          label="Help Text"
          placeholder="Optional short note shown under the field"
          value={form.helpText}
          onChange={(e) => set('helpText', e.target.value)}
        />

        <AdminCheckbox
          label="Required"
          helper="Admin must fill this before saving the product"
          checked={form.required}
          onChange={(e) => set('required', e.target.checked)}
        />

        {isNumberType && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInput
              label="Min Value"
              type="number"
              placeholder="No minimum"
              value={form.min}
              onChange={(e) => set('min', e.target.value)}
            />
            <AdminInput
              label="Max Value"
              type="number"
              placeholder="No maximum"
              value={form.max}
              onChange={(e) => set('max', e.target.value)}
            />
          </div>
        )}

        {isTextareaType && (
          <AdminInput
            label="Max Length"
            type="number"
            placeholder="No limit"
            value={form.maxLength}
            onChange={(e) => set('maxLength', e.target.value)}
            helper="Maximum number of characters allowed"
          />
        )}

        {isImageType && (
          <AdminCheckbox
            label="Allow multiple images"
            helper="Renders a full image gallery instead of a single upload"
            checked={form.multiple}
            onChange={(e) => set('multiple', e.target.checked)}
          />
        )}

        {isChoiceType && (
          <div className="flex flex-col gap-3 rounded-lg border border-line bg-[rgba(47,31,25,0.02)] p-4">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Options</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AdminInput
                      value={opt.value}
                      onChange={(e) => setOption(i, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <button type="button" onClick={() => removeOption(i)} className="shrink-0 rounded-md border border-line px-2.5 py-2 text-[11px] text-muted hover:border-[#c5221f]/30 hover:text-[#c5221f]">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addOption} className="self-start text-[11px] font-semibold text-terra hover:text-wine">
                  + Add option
                </button>
            </div>
          </div>
        )}
      </form>
    </AdminModal>
  );
}

export default function AdminMasters() {
  const token = getToken();
  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [groupOptions, setGroupOptions] = useState([]);

  const {
    rows, loading, refreshing, pagination, error,
    refresh: loadFields, goToPage, changePageSize, searchTable,
  } = useTableData({
    fetcher: (params) => api.adminListMasters(token, params),
  });

  const loadGroupOptions = React.useCallback(() => {
    api.adminListMasters(token, { limit: 100 })
      .then((res) => {
        const names = (res?.data || []).map((f) => f.group).filter(Boolean);
        setGroupOptions([...new Set(names)].sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => { loadGroupOptions(); }, [loadGroupOptions]);

  async function handleDelete() {
    if (!fieldToDelete) return;
    setDeleting(true);
    try {
      await api.adminDeleteMaster(token, fieldToDelete.id || fieldToDelete._id);
      await loadFields();
      setFieldToDelete(null);
      showSuccess('Field deleted!');
    } catch (err) {
      showError(err.message || 'Failed to delete field');
    } finally {
      setDeleting(false);
    }
  }

  function showSuccess(msg) { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  function showError(msg) { setLocalError(msg); setTimeout(() => setLocalError(''), 3000); }
  function openAdd() { setEditingField(null); setModalOpen(true); }
  function openEdit(f) { setEditingField(f); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditingField(null); }

  const typeLabel = (value) => FIELD_TYPES.find((t) => t.value === value)?.label || value;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-lg font-semibold text-ink">Masters</h2>
        <p className="m-0 mt-1 text-[13px] text-muted">
          Define extra fields for the Add Product form — they show up in a "Custom Fields" section
          on every product, no code changes needed.
        </p>
      </div>

      {success && <div className={`${adminToast} bg-[#e6f4ea] text-[#137333] border border-[rgba(19,115,51,0.15)]`}>{success}</div>}
      {(error || localError) && <div className={`${adminToast} bg-[#fce8e6] text-[#c5221f] border border-[rgba(197,34,31,0.15)]`}>{error || localError}</div>}

      {modalOpen && (
        <MasterModal
          field={editingField}
          onClose={closeModal}
          groupOptions={groupOptions}
          onSaved={() => { loadFields(); loadGroupOptions(); showSuccess(editingField ? 'Field updated!' : 'Field added!'); }}
        />
      )}
      <ConfirmDeleteModal
        isOpen={Boolean(fieldToDelete)}
        onClose={() => setFieldToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={fieldToDelete?.label ? `"${fieldToDelete.label}"` : 'this field'}
      />

      <AdminTable
        title="Masters"
        searchKeys={['label', 'key']}
        onAdd={openAdd}
        addLabel="Add Master Field"
        onRefresh={loadFields}
        loading={loading}
        refreshing={refreshing}
        pagination={pagination}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onServerSearch={searchTable}
        columns={[
          {
            key: 'label',
            header: 'Field',
            render: (f) => (
              <div>
                <b className="text-ink">{f.label}</b>
                {f.required && <span className="ml-1.5 text-[10px] font-semibold text-[#c5221f]">required</span>}
                <small className="block text-[11px] text-muted">
                  key: {f.key}{f.group ? ` · ${f.group}` : ''}
                </small>
              </div>
            ),
          },
          { key: 'fieldType', header: 'Type', render: (f) => <span className="text-[12px] text-ink">{typeLabel(f.fieldType)}</span> },
          {
            key: 'isActive',
            header: 'Status',
            render: (f) => (
              <span className={`text-[11px] font-semibold ${f.isActive ? 'text-[#137333]' : 'text-muted'}`}>
                {f.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
        rows={rows}
        rowKey="id"
        rowActions={[
          { label: 'Edit', onClick: openEdit },
          { label: 'Delete', danger: true, onClick: setFieldToDelete },
        ]}
        emptyMessage="No master fields yet. Click Add Master Field to create one."
      />
    </div>
  );
}
