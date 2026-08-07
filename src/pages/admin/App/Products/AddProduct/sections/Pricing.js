import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import FormField from '../../../../Common/Form/FormField';
import { GST_SLABS } from '../constants/options';

export default function Pricing({ register, errors, formValues }) {
  const mrp = parseFloat(formValues.mrp) || 0;
  const sellingPrice = parseFloat(formValues.sellingPrice) || 0;
  const costPrice = parseFloat(formValues.costPrice) || 0;
  const discount = mrp > 0 && sellingPrice > 0
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;
  const profitMargin = sellingPrice > 0 && costPrice > 0
    ? (((sellingPrice - costPrice) / sellingPrice) * 100).toFixed(2)
    : 0;

  return (
    <CollapsibleCard title="Pricing" icon={FiDollarSign} defaultOpen={true}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label="MRP (₹)"
          name="mrp"
          type="number"
          register={register}
          error={errors.mrp?.message}
          placeholder="e.g. 4999"
          min="0"
          helper="Maximum retail price"
          required
        />
        <FormField
          label="Selling Price (₹)"
          name="sellingPrice"
          type="number"
          register={register}
          error={errors.sellingPrice?.message}
          placeholder="e.g. 2999"
          min="0"
          required
        />
        <FormField
          label="Cost Price (₹)"
          name="costPrice"
          type="number"
          register={register}
          error={errors.costPrice?.message}
          placeholder="e.g. 1500"
          min="0"
          helper="Your cost"
        />
<FormField
          label="GST (%)"
          name="gst"
          type="select"
          register={register}
          value={formValues.gst}
          error={errors.gst?.message}
          options={GST_SLABS}
          placeholder="Select GST"
        />

        {/* Calculated Fields */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-gray-600">
            Discount (Auto-calculated)
            <span className="font-normal tracking-normal text-gray-400 ml-1.5">(Auto)</span>
          </label>
          <div className={`px-3.5 py-2.5 border rounded-lg text-[13px] font-semibold bg-gray-50 border-gray-200 ${discount > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
            {discount > 0 ? `${discount}% OFF` : '—'}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-wide text-gray-600">
            Profit Margin
            <span className="font-normal tracking-normal text-gray-400 ml-1.5">(Auto)</span>
          </label>
          <div className={`px-3.5 py-2.5 border rounded-lg text-[13px] font-semibold bg-gray-50 border-gray-200 ${profitMargin > 0 ? 'text-terra' : 'text-gray-400'}`}>
            {profitMargin > 0 ? `${profitMargin}%` : '—'}
          </div>
        </div>

        {/* Summary */}
        {mrp > 0 && sellingPrice > 0 && (
          <div className="sm:col-span-2 lg:col-span-3 p-3 rounded-lg bg-gradient-to-r from-terra/5 to-transparent border border-terra/10">
            <div className="flex items-center gap-4 text-[12px]">
              <span className="text-gray-500">MRP: <span className="text-gray-700 font-semibold">₹{mrp.toLocaleString('en-IN')}</span></span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">Selling: <span className="text-terra font-semibold">₹{sellingPrice.toLocaleString('en-IN')}</span></span>
              {costPrice > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">Cost: <span className="text-gray-700 font-semibold">₹{costPrice.toLocaleString('en-IN')}</span></span>
                </>
              )}
              {discount > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-emerald-600 font-semibold">You save: ₹{(mrp - sellingPrice).toLocaleString('en-IN')} ({discount}%)</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </CollapsibleCard>
  );
}

