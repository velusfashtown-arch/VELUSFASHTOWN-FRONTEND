import React from 'react';
import { FiLayers } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import AdminCheckbox from '../../../../Common/Form/Checkbox';
import FormField from '../../../../Common/Form/FormField';
import { COLORS, BLOUSE_TYPES } from '../constants/options';

export default function BlouseDetails({ register, errors, formValues }) {
  const colorOptions = COLORS.map(c => ({ value: c.value, label: c.label }));

  return (
    <CollapsibleCard title="Blouse Details" icon={FiLayers} defaultOpen={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCheckbox
          label="Blouse Included"
          helper="Included with saree"
          {...register('blouseIncluded')}
        />
        <FormField label="Blouse Type" name="blouseType" type="select" register={register} value={formValues.blouseType} error={errors.blouseType?.message} options={BLOUSE_TYPES} placeholder="Select blouse type" />
        <FormField label="Blouse Color" name="blouseColor" type="select" register={register} value={formValues.blouseColor} error={errors.blouseColor?.message} options={colorOptions} placeholder="Select blouse color" />
      </div>
    </CollapsibleCard>
  );
}
