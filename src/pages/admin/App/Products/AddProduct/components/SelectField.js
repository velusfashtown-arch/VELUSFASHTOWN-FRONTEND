import React from 'react';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '38px',
    border: state.isFocused ? '1px solid #a74e3e' : '1px solid #e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(167, 78, 62, 0.1)' : 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontFamily: 'DM Sans, Arial, sans-serif',
    '&:hover': {
      border: state.isFocused ? '1px solid #a74e3e' : '1px solid #d1d5db',
    },
    backgroundColor: 'white',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '13px',
    fontFamily: 'DM Sans, Arial, sans-serif',
    backgroundColor: state.isFocused ? 'rgba(167, 78, 62, 0.08)' : state.isSelected ? '#a74e3e' : 'white',
    color: state.isSelected ? 'white' : '#241b18',
    cursor: 'pointer',
    padding: '8px 12px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '13px',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(167, 78, 62, 0.08)',
    borderRadius: '6px',
    border: '1px solid rgba(167, 78, 62, 0.15)',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#a74e3e',
    fontSize: '12px',
    fontWeight: 500,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#a74e3e',
    borderRadius: '0 6px 6px 0',
    '&:hover': {
      backgroundColor: '#a74e3e',
      color: 'white',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    zIndex: 50,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  isMulti = false,
  isSearchable = true,
  isClearable = false,
  error,
  helper,
  className = '',
  formatOptionLabel,
}) {
  const id = name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold tracking-wide text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {helper && <span className="font-normal tracking-normal text-gray-400 ml-1.5">({helper})</span>}
        </label>
      )}
      <Select
        inputId={id}
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder || `Select ${label || 'option'}`}
        isMulti={isMulti}
        isSearchable={isSearchable}
        isClearable={isClearable}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
        className="react-select-wrapper"
        classNamePrefix="react-select"
      />
      {error && (
        <span className="text-[11px] text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
}

