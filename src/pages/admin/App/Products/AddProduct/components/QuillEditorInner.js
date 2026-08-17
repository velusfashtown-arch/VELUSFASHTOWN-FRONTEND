import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
];

// Quill 2.x (bundled by react-quill-new) merged the old separate 'bullet'
// format into 'list' — 'list: ordered|bullet' is now a value of the single
// 'list' format, not two distinct registered format names.
const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'indent', 'align',
  'blockquote', 'code-block',
  'link',
];

export default function QuillEditorInner({ value, onChange, placeholder, onError }) {
  try {
    const modules = useMemo(() => ({
      toolbar: {
        container: TOOLBAR_OPTIONS,
      },
      clipboard: {
        matchVisual: false,
      },
    }), []);

    return (
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || 'Write your content here...'}
        className="text-[13px] font-sans"
      />
    );
  } catch (e) {
    if (onError) onError();
    return null;
  }
}

