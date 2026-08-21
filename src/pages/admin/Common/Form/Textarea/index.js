import React from 'react';

export default function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  rows = 3,
  helper,
  error,
  className = '',
  inputRef,
  ...props
}) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'textarea-field');
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
          {label}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={inputRef}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3 py-2.5 border rounded-md text-[13px] text-ink outline-none transition-colors resize-y min-h-[60px] font-sans ${
          error
            ? 'border-danger bg-danger/10 focus:border-danger'
            : 'border-line focus:border-terra'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#f5f0eb]' : ''}`}
        {...props}
      />
      {error && <span className="text-[10px] text-danger font-medium">{error}</span>}
    </div>
  );
}

