import React from 'react';
import { FiFileText } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import RichTextEditor from '../components/RichTextEditor';

export default function Description({ register, errors, setValue, formValues }) {
  return (
    <CollapsibleCard title="Description" icon={FiFileText} defaultOpen={true}>
      <div className="grid grid-cols-1 gap-4">
        <FormField label="Short Description" name="shortDescription" type="textarea" register={register} error={errors.shortDescription?.message} placeholder="Brief description for product cards and listings (max 300 characters)" rows={2} maxLength={300} />
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-gray-600">Long Description<span className="font-normal tracking-normal text-gray-400 ml-1.5">(Rich text)</span></label>
          <RichTextEditor value={formValues.longDescription || ''} onChange={(value) => setValue('longDescription', value)} placeholder="Describe your product in detail..." />
        </div>
      </div>
    </CollapsibleCard>
  );
}
