import React, { useState } from 'react';
import { FiGitBranch, FiPlus } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import VariantRow from '../components/VariantRow';
import { variantInitialValues } from '../constants/initialValues';

export default function Variants({ variants, setVariants, token, productId, baseSku }) {
  const addVariant = () => {
    setVariants([...variants, { ...variantInitialValues }]);
  };

  const updateVariant = (index, field, value) => {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    setVariants(updated);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <CollapsibleCard
      title="Variants"
      icon={FiGitBranch}
      defaultOpen={false}
      badge={variants.length}
    >
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <VariantRow
            key={index}
            index={index}
            variant={variant}
            onUpdate={updateVariant}
            onRemove={removeVariant}
            token={token}
            productId={productId}
            baseSku={baseSku}
          />
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-terra/50 hover:text-terra transition-all duration-200 text-[13px] font-medium"
        >
          <FiPlus className="w-4 h-4" />
          Add Variant
        </button>

        {variants.length > 0 && (
          <p className="text-[11px] text-gray-400 text-center">
            Add one variant for each available color
          </p>
        )}
      </div>
    </CollapsibleCard>
  );
}

