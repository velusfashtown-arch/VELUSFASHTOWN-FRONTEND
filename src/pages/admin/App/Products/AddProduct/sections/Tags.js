import React from 'react';
import { FiTag } from 'react-icons/fi';
import CollapsibleCard from '../components/CollapsibleCard';
import TagInput from '../components/TagInput';

export default function Tags({ tags, setTags }) {
  return (
    <CollapsibleCard title="Tags" icon={FiTag} defaultOpen={false}>
      <TagInput
        label="Product Tags"
        tags={tags}
        onTagsChange={setTags}
        placeholder="Type tag and press Enter"
        helper="Press Enter or comma to add tags"
        suggestions={[
          'trending', 'new', 'bestseller', 'premium', 'handloom',
          'ethnic', 'wedding', 'festival', 'casual', 'party',
          'traditional', 'modern', 'silk', 'cotton', 'designer'
        ]}
      />
    </CollapsibleCard>
  );
}

