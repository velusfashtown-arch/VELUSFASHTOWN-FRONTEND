import React from 'react';

export default function AdminInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  disabled,
  min,
  max,
  step,
  helper,
  error,
  className = '',
  inputRef,
  icon,
  ...props
}) {
const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'input-field');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
          {label}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
          {required && <span className="text-[#c5221f] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted [&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        )}
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`w-full border rounded-md text-[13px] text-ink outline-none transition-colors font-sans ${
            icon ? 'pl-9' : 'pl-3'
          } pr-3 py-2.5 ${
            error
              ? 'border-[#c5221f] bg-[#fce8e6] focus:border-[#c5221f]'
              : 'border-line focus:border-terra'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#f5f0eb]' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] text-[#c5221f] font-medium">{error}</span>}
    </div>
  );
}

