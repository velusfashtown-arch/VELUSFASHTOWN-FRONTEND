import React from 'react';

export default function AdminCheckbox({
  label,
  checked,
  onChange,
  disabled,
  helper,
  className = '',
  children,
  ...props
}) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'checkbox-field');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2.5 py-1.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 accent-terra cursor-pointer"
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-[12px] font-medium text-ink cursor-pointer select-none">
            {label}
          </label>
        )}
        {children}
      </div>
      {helper && <span className="text-[10px] text-muted -mt-1 ml-6">{helper}</span>}
    </div>
  );
}

