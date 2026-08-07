import React from 'react';
import { FiTruck } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import AdminRadioGroup from '../../../../Common/Form/RadioGroup';

export default function Shipping({ register, errors }) {
  return (
    <CollapsibleCard title="Shipping" icon={FiTruck} defaultOpen={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Weight (gms)"
          name="shippingWeight"
          type="number"
          register={register}
          error={errors.shippingWeight?.message}
          placeholder="e.g. 500"
          min="0"
          helper="For courier calculation"
        />
        <FormField
          label="Length (cm)"
          name="shippingLength"
          type="number"
          register={register}
          error={errors.shippingLength?.message}
          placeholder="e.g. 30"
          min="0"
        />
        <FormField
          label="Width (cm)"
          name="shippingWidth"
          type="number"
          register={register}
          error={errors.shippingWidth?.message}
          placeholder="e.g. 20"
          min="0"
        />
        <FormField
          label="Height (cm)"
          name="shippingHeight"
          type="number"
          register={register}
          error={errors.shippingHeight?.message}
          placeholder="e.g. 10"
          min="0"
        />
        <FormField
          label="Shipping Charge (₹)"
          name="shippingCharge"
          type="number"
          register={register}
          error={errors.shippingCharge?.message}
          placeholder="e.g. 49"
          min="0"
          helper="Leave 0 for free shipping"
        />
        <AdminRadioGroup
          label="Cash on Delivery (COD)"
          name="codAvailable"
          register={register}
          options={[
            { label: 'Available', value: 'true', defaultChecked: true },
            { label: 'Not Available', value: 'false' },
          ]}
        />
      </div>
    </CollapsibleCard>
  );
}

