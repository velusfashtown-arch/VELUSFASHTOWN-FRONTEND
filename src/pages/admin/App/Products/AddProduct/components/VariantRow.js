import React, { useCallback } from 'react';
import { FiMove, FiTrash2, FiImage } from 'react-icons/fi';
import FormField from '../../../../Common/Form/FormField';
import AdminCheckbox from '../../../../Common/Form/Checkbox';
import ImageDropzone from './ImageDropzone';
import { useImageUpload } from '../hooks/useImageUpload';

export default function VariantRow({ index, variant, onUpdate, onRemove, token, productId, baseSku }) {
  const { uploadImages, uploading, uploadProgress } = useImageUpload(token);

  const handleColorChange = useCallback((event) => {
    const value = event.target.value;
    onUpdate(index, 'color', value);

    if (!variant.sku && value) {
      const suffix = value.slice(0, 3).toUpperCase();
      onUpdate(index, 'sku', `${baseSku || 'VAR'}-${suffix}`);
    }
  }, [index, onUpdate, variant.sku, baseSku]);

  const handleImagesChange = useCallback((images) => {
    onUpdate(index, 'images', images);
  }, [index, onUpdate]);

  const handleImageUpload = useCallback(async (files) => {
    return uploadImages(files, productId);
  }, [uploadImages, productId]);

  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMove className="h-4 w-4 cursor-grab text-gray-300" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            Color Variant #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <AdminCheckbox
            label="Available"
            checked={variant.isActive !== false}
            onChange={(e) => onUpdate(index, 'isActive', e.target.checked)}
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title="Remove color variant"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FormField
          label="Color"
          name={`variant-${index}-color`}
          type="text"
          value={variant.color || ''}
          onChange={handleColorChange}
          placeholder="e.g. Red"
          required
        />
        <FormField
          label="Variant SKU"
          name={`variant-${index}-sku`}
          type="text"
          value={variant.sku || ''}
          onChange={(e) => onUpdate(index, 'sku', e.target.value)}
          placeholder="Auto-filled from color"
        />
        <FormField
          label="Price Override (₹)"
          name={`variant-${index}-price`}
          type="number"
          value={variant.price ?? ''}
          onChange={(e) => onUpdate(index, 'price', e.target.value)}
          placeholder="Same as base price"
          min="0"
          helper="Leave blank to use base price"
        />
        <FormField
          label="MRP Override (₹)"
          name={`variant-${index}-mrp`}
          type="number"
          value={variant.mrp ?? ''}
          onChange={(e) => onUpdate(index, 'mrp', e.target.value)}
          placeholder="Same as base MRP"
          min="0"
        />
        <FormField
          label="Stock"
          name={`variant-${index}-stock`}
          type="number"
          value={variant.stock ?? ''}
          onChange={(e) => onUpdate(index, 'stock', e.target.value)}
          placeholder="e.g. 20"
          min="0"
          required
        />
      </div>

      <div className="mt-3">
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-gray-600">
          <FiImage className="h-3.5 w-3.5" /> Images for this color
        </label>
        <ImageDropzone
          images={variant.images || []}
          onImagesChange={handleImagesChange}
          uploading={uploading}
          uploadProgress={uploadProgress}
          minImages={1}
          maxImages={10}
          onUpload={handleImageUpload}
        />
        <p className="mt-1 text-[10px] text-gray-400">
          Selecting this color on the storefront swaps the product gallery to these images.
        </p>
      </div>
    </div>
  );
}
