import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet', 'indent', 'align',
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

