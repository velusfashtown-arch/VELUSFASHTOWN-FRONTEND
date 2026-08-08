import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const defaultClassNames = {
  root: "",
  button: "",
  menu: "",
  option: "",
};

export default function Listbox({
  data = [],
  value = null,
  onChange,
  showSelectedIcon = true,
  classNames: customClassNames = {},
  inputProps = {},
  label,
  placeholder = "Select...",
  disabled = false,
  error,
  helper,
  size = "md",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const mergedClassNames = { ...defaultClassNames, ...customClassNames };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleSelect = (option) => {
    if (onChange) onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = value?.label || placeholder;
  const selectedValue = value?.value;

  const { className: inputClassName, classNames: inputSubClassNames, ...restInputProps } = inputProps;

const sizeClasses = {
    sm: "py-2 px-2.5 text-[12px] rounded-md",
    md: "py-2.5 px-3 text-[13px] rounded-md",
    lg: "py-3 px-4 text-[14px] rounded-md",
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div ref={containerRef} className={`relative ${mergedClassNames.root}`}>
      {label && (
        <label className="block text-[10px] font-bold tracking-[0.08em] uppercase text-muted mb-1.5">
          {label}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => {
            const next = !prev;
            if (next && buttonRef.current) {
              const rect = buttonRef.current.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              setOpenUpward(spaceBelow < 250 && rect.top > 250);
            }
            return next;
          });
        }}
        disabled={disabled}
        className={`
          inline-flex w-full items-center justify-between gap-2 whitespace-nowrap border font-sans transition-colors outline-none
          ${selectedSizeClass}
          ${disabled
            ? 'opacity-50 cursor-not-allowed bg-[#f5f0eb] text-muted border-line'
            : 'bg-white border-line text-ink hover:border-terra focus:border-terra'
          }
          ${error ? 'border-[#c5221f] bg-[#fce8e6] focus:border-[#c5221f]' : ''}
          ${inputClassName || ''}
          ${mergedClassNames.button}
        `}
        {...restInputProps}
      >
        <span className={`truncate ${!selectedValue || selectedValue === '' ? 'text-muted' : 'text-ink'}`}>
          {selectedLabel}
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            disabled ? 'text-muted' : 'text-muted'
          }`}
        />
      </button>

      {error && <span className="text-[10px] text-[#c5221f] font-medium mt-1 block">{error}</span>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 w-full rounded-lg border bg-white shadow-[0_8px_24px_rgba(47,31,25,0.12)] overflow-hidden
            ${openUpward ? 'bottom-full mb-1.5 origin-bottom-right' : 'top-full mt-1.5 origin-top-right'}
            ${mergedClassNames.menu || 'border-[rgba(47,31,25,0.12)]'}
          `}
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {data.length > 0 ? (
              data.map((option, index) => {
                const isSelected = option.value === selectedValue;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors
                      ${isSelected
                        ? 'bg-terra/8 text-terra font-medium'
                        : 'text-ink hover:bg-[rgba(47,31,25,0.04)]'
                      }
                      ${mergedClassNames.option}
                    `}
                  >
                    {showSelectedIcon && (
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {isSelected && <CheckIcon className="size-4 text-terra" />}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-3 text-center text-sm text-muted">
                No options available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

