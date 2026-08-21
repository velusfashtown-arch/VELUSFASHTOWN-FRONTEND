import React, { useMemo } from 'react';
import { FiSliders, FiInfo, FiDollarSign, FiPackage, FiLayers, FiImage, FiVideo, FiFileText, FiTag } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import RichTextEditor from '../components/RichTextEditor';
import ImageDropzone from '../components/ImageDropzone';
import FormField from '../../../../Common/Form/FormField';
import AdminCheckbox from '../../../../Common/Form/Checkbox';
import { initialFormValues } from '../constants/initialValues';

const GROUP_ICONS = {
  'Basic Information': FiInfo,
  'Pricing': FiDollarSign,
  'Inventory': FiPackage,
  'Saree Details': FiLayers,
  'Blouse Details': FiLayers,
  'Images': FiImage,
  'Videos': FiVideo,
  'Description': FiFileText,
  'Additional Details': FiTag,
};

const OPEN_BY_DEFAULT = new Set(['Basic Information', 'Pricing', 'Inventory', 'Images']);

// Fixed fields, not stored in Masters — Category/Sub Category always come
// from the live Category/SubCategory tables (active records only, filtered
// by the caller) rather than admin-defined options, so they're pinned to
// the front of Basic Information instead of being configurable.
const FIXED_BASIC_INFO_FIELDS = [
  { key: 'category', label: 'Category', fieldType: 'dropdown', required: true, placeholder: 'Select category', group: 'Basic Information' },
  { key: 'subCategory', label: 'Sub Category', fieldType: 'dropdown', required: true, placeholder: 'Select sub category', group: 'Basic Information' },
];

// A field whose key matches a real Product form field (see
// initialFormValues) writes straight to that field via `setValue`;
// any other key is a genuinely custom field and goes into the
// `customFields` array instead.
//
// Master.key is forced lowercase by the schema (e.g. "productname"), but
// initialFormValues uses camelCase ("productName") — so the match has to
// be case-insensitive, and callers need the *real* camelCase key back to
// actually read/write the right formValues property.
const SCHEMA_KEY_BY_LOWERCASE = Object.keys(initialFormValues).reduce((map, key) => {
  map[key.toLowerCase()] = key;
  return map;
}, {});

function schemaKeyFor(key) {
  return SCHEMA_KEY_BY_LOWERCASE[String(key).toLowerCase()];
}

/**
 * Renders the entire product form (except Variants and Tags, which are
 * structurally too different from a flat field to fit here) from
 * Master entries. Which fields exist, their labels, order
 * and section all come from the Masters admin screen.
 */
export default function DynamicFields({
  fields = [],
  formValues,
  setValue,
  errors,
  categories = [],
  subCategories = [],
  customValues = [],
  setCustomFields,
  onImageUpload,
  uploading,
  uploadProgress,
}) {
  const selectedCategory = formValues.category;

  const groups = useMemo(() => {
    // A field scoped to a category (see the Masters screen) only shows once
    // that category is selected in Basic Information — a global field
    // (category: null) always shows.
    const visibleFields = fields.filter((field) => !field.category || field.category.id === selectedCategory);

    const order = [];
    const byGroup = {};
    // Section names come from free text on the Masters screen — fields
    // that mean the same section but differ by case/whitespace ("Basic
    // Information" vs "Basic information") must still land in the same
    // group instead of splitting into a lookalike section.
    const canonicalKeyFor = {};
    for (const field of [...visibleFields, ...FIXED_BASIC_INFO_FIELDS]) {
      const rawName = (field.group || 'Custom Fields').trim() || 'Custom Fields';
      const normalized = rawName.toLowerCase();
      if (!(normalized in canonicalKeyFor)) {
        canonicalKeyFor[normalized] = rawName;
        byGroup[rawName] = [];
        order.push(rawName);
      }
      byGroup[canonicalKeyFor[normalized]].push(field);
    }
    return order.map((name) => ({ name, fields: byGroup[name] }));
  }, [fields, selectedCategory]);

  function getValue(field, fallback = '') {
    const schemaKey = schemaKeyFor(field.key);
    if (schemaKey) return formValues[schemaKey] ?? fallback;
    const entry = customValues.find((v) => v.key === field.key);
    return entry ? entry.value : fallback;
  }

  function setFieldValue(field, val) {
    const schemaKey = schemaKeyFor(field.key);
    if (schemaKey) {
      setValue(schemaKey, val, { shouldValidate: true, shouldDirty: true });
      if (schemaKey === 'category') {
        setValue('subCategory', '', { shouldValidate: true, shouldDirty: true });
      }
      return;
    }
    const exists = customValues.some((v) => v.key === field.key);
    const next = exists
      ? customValues.map((v) => (v.key === field.key ? { ...v, value: val } : v))
      : [...customValues, { key: field.key, value: val }];
    setCustomFields(next);
  }

  function choiceOptions(field) {
    if (field.key === 'category') {
      return categories.map((c) => ({ value: c.id, label: c.name }));
    }
    if (field.key === 'subCategory') {
      return subCategories
        .filter((c) => String(c.category?.id || c.category || '') === String(formValues.category || ''))
        .map((c) => ({ value: c.id, label: c.name }));
    }
    return (field.options || []).map((o) => ({ value: o.value, label: o.label || o.value }));
  }

  function renderField(field) {
    const key = field.key;
    const schemaKey = schemaKeyFor(field.key);
    const errorMsg = schemaKey ? errors[schemaKey]?.message : undefined;

    switch (field.fieldType) {
      case 'text':
        return (
          <FormField
            key={key}
            label={field.label}
            type="text"
            value={getValue(field, '')}
            onChange={(e) => setFieldValue(field, e.target.value)}
            placeholder={field.placeholder}
            helper={field.helpText}
            error={errorMsg}
            required={field.required}
          />
        );
      case 'number':
        return (
          <FormField
            key={key}
            label={field.label}
            type="number"
            value={getValue(field, '')}
            onChange={(e) => setFieldValue(field, e.target.value)}
            placeholder={field.placeholder}
            helper={field.helpText}
            error={errorMsg}
            required={field.required}
            min={field.min ?? undefined}
            max={field.max ?? undefined}
          />
        );
      case 'textarea':
        return (
          <div key={key} className="sm:col-span-2 lg:col-span-3">
            <FormField
              label={field.label}
              type="textarea"
              value={getValue(field, '')}
              onChange={(e) => setFieldValue(field, e.target.value)}
              placeholder={field.placeholder}
              helper={field.helpText}
              error={errorMsg}
              required={field.required}
              maxLength={field.maxLength ?? undefined}
            />
          </div>
        );
      case 'dropdown':
        return (
          <FormField
            key={key}
            label={field.label}
            type="select"
            value={getValue(field, '')}
            onChange={(e) => setFieldValue(field, e.target.value)}
            options={choiceOptions(field)}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
            helper={field.helpText}
            error={errorMsg}
            required={field.required}
          />
        );
      case 'checkbox':
        return (
          <AdminCheckbox
            key={key}
            label={field.label}
            helper={field.helpText}
            checked={Boolean(getValue(field, false))}
            onChange={(e) => setFieldValue(field, e.target.checked)}
          />
        );
      case 'radio': {
        const opts = choiceOptions(field);
        const current = getValue(field, '');
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              {field.label}{field.required && <span className="ml-0.5 text-[#c5221f]">*</span>}
            </label>
            <div className="flex min-h-[42px] flex-wrap items-center gap-x-4 gap-y-2">
              {opts.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-[13px] text-ink">
                  <input
                    type="radio"
                    checked={current === opt.value}
                    onChange={() => setFieldValue(field, opt.value)}
                    className="h-4 w-4 accent-terra"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {field.helpText && <span className="text-[11px] text-muted">{field.helpText}</span>}
          </div>
        );
      }
      case 'richtext':
        return (
          <div key={key} className="sm:col-span-2 lg:col-span-3">
            <RichTextEditor
              label={field.label}
              value={getValue(field, '')}
              onChange={(val) => setFieldValue(field, val)}
              placeholder={field.placeholder}
              helper={field.helpText}
              required={field.required}
            />
          </div>
        );
      case 'image': {
        const raw = getValue(field, field.multiple ? [] : '');
        const images = field.multiple ? (Array.isArray(raw) ? raw : []) : (raw ? [raw] : []);
        return (
          <div key={key} className="sm:col-span-2 lg:col-span-3">
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              {field.label}{field.required && <span className="ml-0.5 text-[#c5221f]">*</span>}
            </label>
            <ImageDropzone
              images={images}
              onImagesChange={(next) => setFieldValue(field, field.multiple ? next : (next[next.length - 1] || ''))}
              uploading={uploading}
              uploadProgress={uploadProgress}
              minImages={field.required ? 1 : 0}
              maxImages={field.multiple ? 20 : 1}
              onUpload={onImageUpload}
              error={errorMsg}
            />
            {field.helpText && <p className="mt-1 text-[10px] text-muted">{field.helpText}</p>}
          </div>
        );
      }
      default:
        return null;
    }
  }

  return (
    <>
      {groups.map(({ name, fields: groupFields }) => (
        <CollapsibleCard
          key={name}
          title={name}
          icon={GROUP_ICONS[name] || FiSliders}
          defaultOpen={OPEN_BY_DEFAULT.has(name)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupFields.map(renderField)}
          </div>
        </CollapsibleCard>
      ))}
    </>
  );
}
