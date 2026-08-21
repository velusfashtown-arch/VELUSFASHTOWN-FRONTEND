import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiEye, FiRotateCcw, FiSave } from 'react-icons/fi';
import { getToken } from '../../../../../lib/auth';
import { api } from '../../../../../lib/api';
import { productService } from '../../../../../services/productService';
import DynamicFields from './sections/DynamicFields';
import Tags from './sections/Tags';
import Variants from './sections/Variants';
import LoadingSkeleton from './components/LoadingSkeleton';
import Toast from './components/Toast';
import { useAutoSave } from './hooks/useAutoSave';
import { useImageUpload } from './hooks/useImageUpload';
import { useProductForm } from './hooks/useProductForm';
import { useMasterFields } from './hooks/useMasterFields';
import { adminBtnPrimary, adminBtnSecondary, adminBtnBack, adminBtnDanger } from '../../../Common/buttonClasses';

export default function AddProduct({ onBack, onProductSaved, editProduct }) {
  const token = getToken();
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const isEdit = Boolean(editProduct);
const {
    register,
    handleSubmit,
    setValue,
    reset,
    formValues,
    errors,
    isDirty,
    isSubmitting,
    getValues,
handleImageChange,
    setTags,
    setVariants,
    setCustomFields,
  } = useProductForm(editProduct);
  const { uploadImages, uploading, uploadProgress } = useImageUpload(token);
  const { saveDraft, clearDraft, getDraft } = useAutoSave(formValues, isDirty, isEdit);
  const { fields: masterFields } = useMasterFields();

useEffect(() => {
    // Always start with a blank form when adding a new product.
    // Do NOT auto-load any saved draft so the form is completely empty.
    if (!isEdit) {
      reset();
    }

    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, [getDraft, isEdit, reset, setValue]);

  useEffect(() => {
    api.adminListCategories(token, { isActive: 'true', limit: 100 })
      .then((response) => setCategories(response.data || []))
      .catch(() => setCategories([]));
    api.adminListSubCategories(token, { isActive: 'true', limit: 100 })
      .then((response) => setSubCategories(response.data || []))
      .catch(() => setSubCategories([]));
  }, [token]);

  useEffect(() => {
    // Reserve a productId upfront so image uploads can go straight to
    // /uploads/products/{productId}/ before the product itself is saved.
    if (!isEdit) {
      api.adminReserveProductId(token)
        .then((res) => setValue('productId', res?.data?.productId || ''))
        .catch(() => showToast('Could not reserve a product ID. Image upload may fail.', 'error'));
    }
    // eslint-disable-next-line
  }, [isEdit]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleImageUpload = useCallback(async (files) => {
    try {
      return await uploadImages(files, formValues.productId);
    } catch (error) {
      showToast(error.message || 'Image upload failed', 'error');
      return [];
    }
  }, [showToast, uploadImages, formValues.productId]);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await productService.update(editProduct.productId || editProduct.id, data);
        showToast('Product updated successfully!');
      } else {
        await productService.create(data);
        showToast('Product created successfully!');
        clearDraft();
      }
      if (onProductSaved) onProductSaved();
      if (!isEdit) reset();
    } catch (error) {
      showToast(error.message || 'Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  }, [clearDraft, editProduct, isEdit, onProductSaved, reset, showToast]);

  const onError = useCallback((formErrors) => {
    const firstError = Object.values(formErrors).find(Boolean);
    showToast(firstError?.message || 'Please fix the form errors before submitting', 'error');

    const firstErrorField = document.querySelector('[data-error="true"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showToast]);

  const handlePreview = useCallback(() => {
    const productId = getValues('productId');
    if (!productId) {
      showToast('Save the product before previewing its live page', 'error');
      return;
    }
    window.open(`/product/${productId}`, '_blank');
  }, [getValues, showToast]);

  if (initialLoading) {
    return (
      <div className="rounded-xl border border-[rgba(47,31,25,0.1)] bg-paper shadow-[0_12px_32px_rgba(47,31,25,0.06)]">
        <LoadingSkeleton sections={6} />
      </div>
    );
  }

  return (
    <div ref={formRef} className="relative min-w-0">
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}

<div className="sticky top-[60px] z-10 overflow-hidden rounded-xl border border-[rgba(47,31,25,0.1)] bg-paper/95 shadow-[0_12px_32px_rgba(47,31,25,0.06)] backdrop-blur-sm">
        <div className="flex flex-col gap-3 px-4 py-3 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className={adminBtnBack}
            >
              ← Back
            </button>
            <span className="h-6 w-px shrink-0 bg-[rgba(47,31,25,0.1)]" />
            <div className="min-w-0">
              <h3 className="truncate font-playfair text-base font-semibold text-ink">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="mt-0.5 text-[11px] text-muted">
                {isDirty ? 'Unsaved changes' : 'All changes saved'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap xl:justify-end">
            <button
              type="button"
              onClick={handlePreview}
              className={`${adminBtnSecondary} min-h-[38px] rounded-lg px-3 py-2 text-[11px] normal-case tracking-[0.02em]`}
            >
              <FiEye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              onClick={() => { saveDraft(); showToast('Draft saved!', 'info'); }}
              className={`${adminBtnSecondary} min-h-[38px] rounded-lg px-3 py-2 text-[11px] normal-case tracking-[0.02em]`}
            >
              <FiClock className="h-3.5 w-3.5" /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => { reset(); showToast('Form reset', 'info'); }}
              className={`${adminBtnDanger} min-h-[38px] rounded-lg px-3 py-2 text-[11px] normal-case tracking-[0.02em]`}
            >
              <FiRotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              type="submit"
              form="add-product-form"
              disabled={loading || isSubmitting}
              className={`${adminBtnPrimary} min-h-[38px] rounded-lg px-4 py-2 text-[11px]`}
            >
              <FiSave className="h-3.5 w-3.5" /> {loading ? 'Saving...' : (isEdit ? 'Update' : 'Publish')}
            </button>
          </div>
        </div>
        {isDirty && (
          <div className="h-0.5 bg-[rgba(167,78,62,0.12)]">
            <motion.div
              className="h-full bg-terra"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 30 }}
            />
          </div>
        )}
      </div>

<form id="add-product-form" onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 py-4 sm:py-5">
<DynamicFields
          fields={masterFields}
          formValues={formValues}
          setValue={setValue}
          errors={errors}
          categories={categories}
          subCategories={subCategories}
          customValues={formValues.customFields || []}
          setCustomFields={setCustomFields}
          onImageUpload={handleImageUpload}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
        <Tags tags={formValues.tags || []} setTags={setTags} />
        <Variants
          variants={formValues.variants || []}
          setVariants={setVariants}
          token={token}
          productId={formValues.productId}
          baseSku={formValues.sku}
        />

        <div className="flex flex-col gap-3 border-t border-[rgba(47,31,25,0.1)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted">
            <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
            All fields are validated in real-time
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {formValues.images?.length >= 4 && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#1e8e3e]">
                <FiCheckCircle className="h-3.5 w-3.5" /> {formValues.images.length} images ready
              </span>
            )}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`${adminBtnPrimary} min-h-[42px] rounded-lg px-6 py-2.5 text-[12px]`}
            >
              <FiSave className="h-4 w-4" /> {loading ? 'Saving Product...' : (isEdit ? 'Update Product' : 'Publish Product')}
            </button>
          </div>
        </div>
</form>
    </div>
  );
}
