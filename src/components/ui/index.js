import React from "react";

// ============================================================
// Checkbox Component
// ============================================================
export function Checkbox({ label, checked, onChange, disabled = false, className = "" }) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={`inline-flex cursor-pointer items-center gap-2.5 select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="size-4 accent-primary-600 cursor-pointer rounded border-slate-300 dark:border-dark-450 dark:bg-dark-600"
      />
      {label && (
        <span className="text-sm text-slate-700 dark:text-dark-100">{label}</span>
      )}
    </label>
  );
}

// ============================================================
// Switch (Toggle) Component
// ============================================================
export function Switch({ label, checked, onChange, disabled = false, className = "" }) {
  const id = React.useId();
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <button
        id={id}
        role="switch"
        type="button"
        disabled={disabled}
        aria-checked={checked}
        onClick={() => onChange({ target: { checked: !checked } })}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked
            ? "bg-primary-600 dark:bg-primary-500"
            : "bg-slate-200 dark:bg-dark-450"
        }`}
      >
        <span
          className={`pointer-events-none inline-block size-4 translate-y-0 rounded-full bg-white shadow-xs ring-0 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {label && (
        <span className="text-sm text-slate-700 dark:text-dark-100">{label}</span>
      )}
    </label>
  );
}

