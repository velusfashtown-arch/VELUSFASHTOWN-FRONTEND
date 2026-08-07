
import React from 'react';
import { FiLayers } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import {
  SAREES_FABRICS, BLOUSE_FABRICS, WORK_TYPES, BORDER_TYPES,
  PALLU_TYPES, PATTERNS, PRINT_TYPES, STYLES, COLORS
} from '../constants/options';

export default function SareeDetails({ register, errors, formValues }) {
  const colorOptions = COLORS.map(c => ({ value: c.value, label: c.label }));

  return (
    <CollapsibleCard title="Saree Details" icon={FiLayers} defaultOpen={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="Saree Fabric"
          name="sareeFabric"
          type="select"
          register={register}
          value={formValues.sareeFabric}
          error={errors.sareeFabric?.message}
          options={SAREES_FABRICS}
          placeholder="Select fabric"
        />
        <FormField
          label="Blouse Fabric"
          name="blouseFabric"
          type="select"
          register={register}
          value={formValues.blouseFabric}
          error={errors.blouseFabric?.message}
          options={BLOUSE_FABRICS}
          placeholder="Select blouse fabric"
        />
        <FormField
          label="Work Type"
          name="workType"
          type="select"
          register={register}
          value={formValues.workType}
          error={errors.workType?.message}
          options={WORK_TYPES}
          placeholder="Select work type"
        />
        <FormField
          label="Border Type"
          name="borderType"
          type="select"
          register={register}
          value={formValues.borderType}
          error={errors.borderType?.message}
          options={BORDER_TYPES}
          placeholder="Select border type"
        />
        <FormField
          label="Pallu Type"
          name="palluType"
          type="select"
          register={register}
          value={formValues.palluType}
          error={errors.palluType?.message}
          options={PALLU_TYPES}
          placeholder="Select pallu type"
        />
        <FormField
          label="Saree Length (Mtrs)"
          name="sareeLength"
          register={register}
          error={errors.sareeLength?.message}
          placeholder="e.g. 5.5"
        />
        <FormField
          label="Blouse Length (Mtrs)"
          name="blouseLength"
          register={register}
          error={errors.blouseLength?.message}
          placeholder="e.g. 0.80"
        />
        <FormField
          label="Weight (gms)"
          name="weight"
          type="number"
          register={register}
          error={errors.weight?.message}
          placeholder="e.g. 500"
          min="0"
        />
<FormField
          label="Primary Color"
          name="primaryColor"
          type="select"
          register={register}
          value={formValues.primaryColor}
          error={errors.primaryColor?.message}
          options={colorOptions}
          placeholder="Select primary color"
        />
        <FormField
          label="Secondary Color"
          name="secondaryColor"
          type="select"
          register={register}
          value={formValues.secondaryColor}
          error={errors.secondaryColor?.message}
          options={colorOptions}
          placeholder="Select secondary color"
        />
        <FormField
          label="Pattern"
          name="pattern"
          type="select"
          register={register}
          value={formValues.pattern}
          error={errors.pattern?.message}
          options={PATTERNS}
          placeholder="Select pattern"
        />
        <FormField
          label="Print Type"
          name="printType"
          type="select"
          register={register}
          value={formValues.printType}
          error={errors.printType?.message}
          options={PRINT_TYPES}
          placeholder="Select print type"
        />
        <FormField
          label="Style"
          name="style"
          type="select"
          register={register}
          value={formValues.style}
          error={errors.style?.message}
          options={STYLES}
          placeholder="Select style"
        />
      </div>
    </CollapsibleCard>
  );
}

