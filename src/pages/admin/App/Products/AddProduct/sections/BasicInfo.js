import React from 'react';
import { FiInfo } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import { PRODUCT_STATUSES } from '../constants/options';

export default function BasicInfo({ register, errors, formValues, categories = [] }) {
  const categoryOptions = categories
    .filter((category) => !category.parent)
    .map((category) => ({ value: category.id, label: category.name }));
  const subCategoryOptions = categories
    .filter((category) => String(category.parent?.id || category.parent || '') === String(formValues.category || ''))
    .map((category) => ({ value: category.id, label: category.name }));

  return (
    <CollapsibleCard title="Basic Information" icon={FiInfo} defaultOpen={true}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="sm:col-span-2 lg:col-span-3">
          <FormField
            label="Product Name"
            name="productName"
            register={register}
            error={errors.productName?.message}
            placeholder="e.g. Banarasi Silk Saree in Red & Gold"
            required
          />
        </div>
        <FormField
          label="Slug"
          name="slug"
          register={register}
          error={errors.slug?.message}
          placeholder="Auto-generated"
          helper="Auto-generated from name"
          className="opacity-80"
        />
        <FormField
          label="SKU"
          name="sku"
          register={register}
          error={errors.sku?.message}
          placeholder="Auto-generated"
          helper="Auto-generated"
          className="opacity-80"
        />
        <FormField
          label="Category"
          name="category"
          register={register}
          value={formValues.category}
          error={errors.category?.message}
          type="select"
          options={categoryOptions}
          placeholder="Select category"
          required
        />
        <FormField
          label="Sub Category"
          name="subCategory"
          register={register}
          value={formValues.subCategory}
          error={errors.subCategory?.message}
          type="select"
          options={subCategoryOptions}
          placeholder="Select sub category"
          disabled={!formValues.category || subCategoryOptions.length === 0}
        />
        <FormField
          label="Status"
          name="status"
          register={register}
          value={formValues.status}
          error={errors.status?.message}
          type="select"
          options={PRODUCT_STATUSES}
          placeholder="Select status"
        />
      </div>
    </CollapsibleCard>
  );
}
