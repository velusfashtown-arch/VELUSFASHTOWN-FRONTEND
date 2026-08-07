import React, { useRef, useState } from 'react';

export default function AdminUpload({
  images = [],
  onChange,
  token,
  uploadApi,
  minImages = 4,
  maxImages = 20,
  label = 'Product Images',
  helper,
  error,
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalAfterUpload = images.length + files.length;
    if (totalAfterUpload > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images. You can add ${maxImages - images.length} more.`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const result = await uploadApi(token, formData);
      onChange([...images, ...result.urls]);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function removeImage(index) {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const dt = new DataTransfer();
      files.forEach(f => dt.items.add(f));
      fileInputRef.current.files = dt.files;
      handleFileSelect({ target: { files: dt.files } });
    }
  }

  const remaining = maxImages - images.length;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.08em] uppercase text-muted">
            {label}
            {helper && <span className="font-normal lowercase tracking-normal text-[#999] ml-1">({helper})</span>}
            {minImages > 0 && <span className="text-[#c5221f] ml-1">(Minimum {minImages})</span>}
          </span>
          <span className="text-[10px] text-muted">{images.length}/{maxImages}</span>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
          remaining <= 0 ? 'border-[#c5221f] opacity-50 cursor-not-allowed' : 'border-line hover:border-terra'
        }`}
        onClick={() => remaining > 0 && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={remaining <= 0}
        />
        <svg className="w-8 h-8 mx-auto mb-1.5 text-muted opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-xs text-muted mb-0.5">
          {remaining > 0 ? 'Drop images here or click to browse' : 'Maximum images reached'}
        </p>
        <p className="text-[10px] text-[#999]">Supports JPG, PNG, WebP {minImages > 0 && `· Min ${minImages} images`}</p>
      </div>

      {uploading && <p className="text-xs text-terra text-center">Uploading images...</p>}
      {error && <span className="text-[10px] text-[#c5221f] font-medium">{error}</span>}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-1">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-[3/4] rounded-md overflow-hidden border border-line bg-[#f5f0eb]">
              <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[rgba(0,0,0,0.6)] text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[rgba(197,34,31,0.8)]"
              >
                ✕
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-[rgba(0,0,0,0.5)] text-white px-1.5 py-0.5 rounded">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}
      {images.length > 0 && (
        <p className="text-[10px] text-[#999] text-right">{images.length} image{images.length !== 1 ? 's' : ''} uploaded</p>
      )}
    </div>
  );
}

