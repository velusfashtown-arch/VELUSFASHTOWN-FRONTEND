import React from 'react';
import { FiPackage } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';

export default function Inventory({ register, errors }) {
  return (
    <CollapsibleCard title="Inventory" icon={FiPackage} defaultOpen={true}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Stock Quantity"
          name="stock"
          type="number"
          register={register}
          error={errors.stock?.message}
          placeholder="e.g. 100"
          min="0"
          required
        />
        <FormField
          label="Low Stock Alert"
          name="lowStockAlert"
          type="number"
          register={register}
          error={errors.lowStockAlert?.message}
          placeholder="e.g. 10"
          min="1"
          helper="Alert when stock below"
        />
      </div>
    </CollapsibleCard>
  );
}
