import React from 'react';
import AdminDropdown from '../Dropdown';
import AdminInput from '../Input';
import AdminTextarea from '../Textarea';

export default function AdminFormField({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  helper,
  options,
  className = '',
  value,
  ...props
}) {
  const id = props.id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const { ref: inputRef, ...registration } = register && name ? register(name) : {};
  const fieldProps = {
    id,
    label,
    placeholder,
    required,
    disabled,
    helper,
    error,
    className,
    inputRef,
    'data-error': Boolean(error),
    ...registration,
    ...props,
  };

  if (type === 'select') {
    // react-hook-form's register().onChange expects a synthetic-event-like
    // object (reads event.target.name/value); AdminDropdown instead hands
    // back the raw selected value, so bridge the two here.
    const { onChange: rhfOnChange, ...restFieldProps } = fieldProps;
    const handleChange = (val) => rhfOnChange?.({ target: { name, value: val }, type: 'change' });
    return <AdminDropdown {...restFieldProps} value={value} onChange={handleChange} options={options} />;
  }

  if (type === 'textarea') {
    return <AdminTextarea {...fieldProps} />;
  }

  return <AdminInput {...fieldProps} type={type} />;
}
