import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiCheck, FiMove, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export default function ImageDropzone({
  images = [],
  onImagesChange,
  uploading = false,
  uploadProgress = 0,
  maxImages = 20,
  minImages = 4,
  onUpload,
  error,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const totalAfter = images.length + acceptedFiles.length;
    if (totalAfter > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      return;
    }
    if (onUpload) {
      try {
        const urls = await onUpload(acceptedFiles);
        onImagesChange([...images, ...urls]);
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
    }
  }, [images, maxImages, onUpload, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    disabled: uploading || images.length >= maxImages,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = useCallback((index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const setAsThumbnail = useCallback((index) => {
    // Thumbnail is the first image - reorder
    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.unshift(moved);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const handleReorder = useCallback((reorderedImages) => {
    onImagesChange(reorderedImages);
  }, [onImagesChange]);

  const remaining = maxImages - images.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-5 sm:p-6 text-center transition-all duration-200 cursor-pointer
          ${isDragActive && !isDragReject ? 'border-terra bg-terra/5' : ''}
          ${isDragReject ? 'border-danger bg-danger/5' : ''}
          ${uploading || remaining <= 0 ? 'opacity-50 cursor-not-allowed' : 'border-[rgba(47,31,25,0.14)] hover:border-terra/50 hover:bg-terra/[0.02]'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="w-14 h-14 rounded-full bg-terra/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-terra animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div className={`w-14 h-14 rounded-full ${isDragActive ? 'bg-terra/10' : 'bg-[rgba(47,31,25,0.06)]'} flex items-center justify-center`}>
              <FiUpload className={`w-6 h-6 ${isDragActive ? 'text-terra' : 'text-muted'}`} />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-ink">
              {uploading
                ? `Uploading... ${uploadProgress}%`
                : isDragActive
                  ? 'Drop images here'
                  : 'Drop images here or click to browse'}
            </p>
            <p className="text-[11px] text-muted mt-0.5">
              JPG, PNG, WebP • Max 5MB each • {images.length}/{maxImages} used
            </p>
          </div>
          {remaining > 0 && !uploading && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-terra/10 text-terra text-[11px] font-semibold">
              <FiImage className="w-3.5 h-3.5" />
              Browse files
            </span>
          )}
        </div>
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[rgba(47,31,25,0.06)] rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-terra transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Image previews */}
      <AnimatePresence>
        {images.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted">
                Uploaded Images ({images.length})
                <span className="font-normal text-muted ml-1">— Drag to reorder, first is thumbnail</span>
              </span>
            </div>
            <Reorder.Group axis="x" values={images} onReorder={handleReorder} className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <Reorder.Item key={url} value={url} className="relative">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`relative group w-[100px] h-[133px] rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing
                      ${index === 0 ? 'border-terra shadow-md shadow-terra/10' : 'border-[rgba(47,31,25,0.14)]'}`}
                    onClick={() => setPreviewUrl(url)}
                  >
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-terra text-white text-[9px] font-bold">
                        THUMBNAIL
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-150 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPreviewUrl(url); }}
                        className="w-7 h-7 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors"
                        title="Preview"
                      >
                        <FiImage className="w-3.5 h-3.5 text-ink" />
                      </button>
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setAsThumbnail(index); }}
                          className="w-7 h-7 rounded-full bg-paper/90 flex items-center justify-center hover:bg-paper transition-colors"
                          title="Set as thumbnail"
                        >
                          <FiCheck className="w-3.5 h-3.5 text-ink" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                        className="w-7 h-7 rounded-full bg-paper/90 flex items-center justify-center hover:bg-danger/10 transition-colors"
                        title="Remove"
                      >
                        <FiX className="w-3.5 h-3.5 text-danger" />
                      </button>
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/40 text-white text-[9px] font-medium">
                      {index + 1}
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={() => setPreviewUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
              />
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-paper shadow-lg flex items-center justify-center hover:bg-[rgba(47,31,25,0.06)] transition-colors"
              >
                <FiX className="w-4 h-4 text-ink" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <span className="text-[11px] text-danger font-medium">{error}</span>
      )}
      {images.length < minImages && !error && (
        <p className="text-[11px] text-[#b47c2e] flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
          Upload at least {minImages - images.length} more image{minImages - images.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

