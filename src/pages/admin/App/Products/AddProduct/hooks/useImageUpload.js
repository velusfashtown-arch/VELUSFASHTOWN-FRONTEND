import { useState, useCallback } from 'react';
import { api } from '../../../../../../lib/api';

export function useImageUpload(token) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImages = useCallback(async (files, productId) => {
    if (!productId) {
      throw new Error('Product ID not ready yet, please try again in a moment');
    }
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      setUploadProgress(30);
      const result = await api.adminUploadImages(token, formData, productId);
      setUploadProgress(100);
      // API returns: { success: true, data: { images: [{ url, publicId, thumbnail }] } }
      const images = result?.data?.images || [];
      const urls = images.map(img => img.url || img).filter(Boolean);
      return urls;
    } catch (err) {
      throw new Error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [token]);

  const deleteImage = useCallback(async (filename) => {
    try {
      await api.adminDeleteImage(token, filename);
      return true;
    } catch (err) {
      throw new Error(err.message || 'Failed to delete image');
    }
  }, [token]);

  return {
    uploadImages,
    deleteImage,
    uploading,
    uploadProgress,
  };
}

