import React, { useState, lazy, Suspense } from 'react';

const QuillEditorLazy = lazy(() => import('./QuillEditorInner'));

function QuillFallback({ value, onChange, placeholder }) {
  return (
    <div className="flex flex-col">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write your content here...'}
        rows={8}
        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-[13px] text-ink outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/20 transition-all resize-y min-h-[200px] font-sans"
      />
      <p className="text-[10px] text-gray-400 mt-1">Rich text editor loading... Using plain text for now.</p>
    </div>
  );
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Write your content here...',
  error,
  helper,
  className = '',
  required = false,
}) {
  const [quillFailed, setQuillFailed] = useState(false);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-semibold tracking-wide text-gray-600">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {helper && <span className="font-normal tracking-normal text-gray-400 ml-1.5">({helper})</span>}
        </label>
      )}
      <div className="rich-editor-wrapper border border-gray-200 rounded-lg overflow-hidden focus-within:border-terra/50 focus-within:ring-1 focus-within:ring-terra/20 transition-all duration-150">
        {quillFailed ? (
          <QuillFallback value={value} onChange={onChange} placeholder={placeholder} />
        ) : (
          <Suspense fallback={<QuillFallback value={value} onChange={onChange} placeholder={placeholder} />}>
            <QuillEditorLazy
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              onError={() => setQuillFailed(true)}
            />
          </Suspense>
        )}
      </div>
      {error && (
        <span className="text-[11px] text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
}

