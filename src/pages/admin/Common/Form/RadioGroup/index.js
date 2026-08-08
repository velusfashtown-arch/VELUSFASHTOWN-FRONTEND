import React from 'react';

export default function AdminRadioGroup({
  label,
  name,
  register,
  options,
  error,
  className = '',
}) {
  const id = name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <fieldset className={`flex min-w-0 flex-col gap-1.5 border-0 p-0 ${className}`}>
      {label && <legend className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">{label}</legend>}
      <div className="flex min-h-[42px] flex-wrap items-center gap-x-4 gap-y-2">
        {options.map(({ label: optionLabel, value, defaultChecked }) => (
          <label key={value} htmlFor={`${id}-${value}`} className="flex items-center gap-2 cursor-pointer">
            <input
              id={`${id}-${value}`}
              type="radio"
              value={value}
              defaultChecked={defaultChecked}
              className="h-4 w-4 accent-terra"
              {...(register ? register(name) : {})}
            />
            <span className="text-[13px] text-ink">{optionLabel}</span>
          </label>
        ))}
      </div>
      {error && <span className="text-[10px] text-[#c5221f] font-medium">{error}</span>}
    </fieldset>
  );
}
