import React from 'react';
import { FiVideo } from 'react-icons/fi';
import FormField from '../../../../Common/Form/FormField';
import CollapsibleCard from '../components/CollapsibleCard';

export default function Videos({ register, errors }) {
  return (
    <CollapsibleCard title="Videos" icon={FiVideo} defaultOpen={false}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField
          label="Video"
          name="productVideo"
          type="url"
          register={register}
          error={errors.productVideo?.message}
          placeholder="https://example.com/product-video.mp4"
          helper="Direct video URL"
        />
        <FormField
          label="YouTube URL"
          name="youtubeUrl"
          type="url"
          register={register}
          error={errors.youtubeUrl?.message}
          placeholder="https://youtube.com/watch?v=..."
        />
        <FormField
          label="Instagram Reel URL"
          name="instagramReelUrl"
          type="url"
          register={register}
          error={errors.instagramReelUrl?.message}
          placeholder="https://instagram.com/reel/..."
        />
      </div>
    </CollapsibleCard>
  );
}
