import React from 'react';
import { FiMove, FiTrash2 } from 'react-icons/fi';
import FormField from '../../../../Common/Form/FormField';
import { COLORS } from '../constants/options';

export default function VariantRow({ index, variant, onUpdate, onRemove }) {
  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiMove className="h-4 w-4 cursor-grab text-gray-300" />
          <span className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">
            Color Variant #{index + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          title="Remove color variant"
        >
          <FiTrash2 className="h-4 w-4" />
        </button>
      </div>

      <FormField
        label="Color Name"
        name={`variant-${index}-color`}
        type="select"
        value={variant.color || ''}
        onChange={(event) => onUpdate(index, 'color', event.target.value)}
        options={COLORS}
        placeholder="Select color"
        required
      />
    </div>
  );
}
