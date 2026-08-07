import React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';

export default function AdditionalDetails({ register, errors }) {
  return (
    <CollapsibleCard title="Additional Details" icon={FiPlusCircle} defaultOpen={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Country of Origin"
          name="countryOfOrigin"
          register={register}
          error={errors.countryOfOrigin?.message}
          placeholder="India"
        />
        <FormField
          label="Manufacturer"
          name="manufacturer"
          register={register}
          error={errors.manufacturer?.message}
          placeholder="Manufacturer name"
        />
        <FormField
          label="Packer name"
          name="packer"
          register={register}
          error={errors.packer?.message}
          placeholder="Packer name"
        />
      </div>
    </CollapsibleCard>
  );
}
