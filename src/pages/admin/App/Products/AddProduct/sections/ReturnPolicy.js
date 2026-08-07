import React from 'react';
import { FiRotateCcw } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import AdminRadioGroup from '../../../../Common/Form/RadioGroup';
import { RETURN_DAYS_OPTIONS } from '../constants/options';

export default function ReturnPolicy({ register, errors, formValues }) {
  return (
    <CollapsibleCard title="Return Policy" icon={FiRotateCcw} defaultOpen={false}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminRadioGroup
          label="Return Available"
          name="returnAvailable"
          register={register}
          options={[
            { label: 'Yes', value: 'true', defaultChecked: true },
            { label: 'No', value: 'false' },
          ]}
        />

<FormField
          label="Return Days"
          name="returnDays"
          type="select"
          register={register}
          value={formValues.returnDays}
          error={errors.returnDays?.message}
          options={RETURN_DAYS_OPTIONS}
        />

        <AdminRadioGroup
          label="Exchange Available"
          name="exchangeAvailable"
          register={register}
          options={[
            { label: 'Yes', value: 'true', defaultChecked: true },
            { label: 'No', value: 'false' },
          ]}
        />
      </div>
    </CollapsibleCard>
  );
}

