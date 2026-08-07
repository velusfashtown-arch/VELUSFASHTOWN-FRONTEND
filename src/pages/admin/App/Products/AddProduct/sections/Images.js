import React from 'react';
import { FiImage } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import ImageDropzone from '../components/ImageDropzone';

export default function Images({ images, onImagesChange, uploading, uploadProgress, onUpload, errors }) {
  return (
    <CollapsibleCard title="Images" icon={FiImage} defaultOpen={true} badge={images.length}>
      <ImageDropzone
        images={images}
        onImagesChange={onImagesChange}
        uploading={uploading}
        uploadProgress={uploadProgress}
        minImages={1}
        maxImages={20}
        onUpload={onUpload}
        error={errors.images?.message}
      />
    </CollapsibleCard>
  );
}

