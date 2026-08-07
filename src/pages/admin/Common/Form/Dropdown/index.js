import React, { useMemo } from 'react';
import Listbox from '../../../../../components/shared/form/Listbox';

export default function AdminDropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  required,
  disabled,
  helper,
  error,
  className = '',
  inputRef,
  ...props
}) {
  const id = props.id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'dropdown-field');

  const normalizedOptions = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === 'object' && opt !== null) {
        return { value: opt.value, label: opt.label };
      }
      return { value: opt, label: opt };
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    if (!value && placeholder) {
      return { value: '', label: placeholder };
    }
    const found = normalizedOptions.find(opt => opt.value === value);
    return found || { value: value || '', label: placeholder || 'Select...' };
  }, [value, normalizedOptions, placeholder]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
          {label}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
          {required && <span className="text-[#c5221f] ml-0.5">*</span>}
        </label>
      )}
<Listbox
        value={selectedOption}
        onChange={(option) => onChange(option?.value)}
        data={normalizedOptions}
        disabled={disabled}
        error={error}
        placeholder={placeholder}
        size="md"
        inputProps={{ id, ...props }}
      />
    </div>
  );
}

