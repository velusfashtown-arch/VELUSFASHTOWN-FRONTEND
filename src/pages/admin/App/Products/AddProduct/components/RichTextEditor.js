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
        className="w-full px-3.5 py-2.5 border border-line rounded-lg text-[13px] text-ink outline-none focus:border-terra/50 focus:ring-1 focus:ring-terra/20 transition-all resize-y min-h-[200px] font-sans"
      />
      <p className="text-[10px] text-muted mt-1">Rich text editor loading... Using plain text for now.</p>
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
        <label className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
          {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
        </label>
      )}
      <div className="rich-editor-wrapper border border-line rounded-lg overflow-hidden focus-within:border-terra/50 focus-within:ring-1 focus-within:ring-terra/20 transition-all duration-150">
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
        <span className="text-[10px] text-danger font-medium">{error}</span>
      )}
    </div>
  );
}

