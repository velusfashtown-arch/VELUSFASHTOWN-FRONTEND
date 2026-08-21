import React, { useState, useRef } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

export default function TagInput({
  label,
  tags = [],
  onTagsChange,
  placeholder = 'Type and press Enter',
  suggestions = [],
  error,
  helper,
  required = false,
  className = '',
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onTagsChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const filteredSuggestions = suggestions.filter(
    s => !tags.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
        </label>
      )}
      <div className={`flex flex-wrap gap-1.5 px-3 py-2 border rounded-lg bg-paper transition-all duration-150 min-h-[42px]
        ${error ? 'border-danger bg-danger/10' : 'border-line focus-within:border-terra/50 focus-within:ring-1 focus-within:ring-terra/20'}`}
      >
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-terra/10 border border-terra/15 text-terra text-[11px] font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="hover:bg-terra/20 rounded p-0.5 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="relative flex-1 min-w-[120px]">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="w-full border-none outline-none text-[13px] py-0.5 bg-transparent text-ink placeholder:text-[#b3aca6]"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-line rounded-lg shadow-[0_12px_32px_rgba(47,31,25,0.1)] z-10 max-h-40 overflow-y-auto">
              {filteredSuggestions.slice(0, 8).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onMouseDown={() => addTag(suggestion)}
                  className="w-full text-left px-3 py-2 text-[13px] text-ink hover:bg-terra/5 transition-colors flex items-center gap-2"
                >
                  <FiPlus className="w-3 h-3 text-terra flex-shrink-0" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <span className="text-[10px] text-danger font-medium">{error}</span>}
    </div>
  );
}

