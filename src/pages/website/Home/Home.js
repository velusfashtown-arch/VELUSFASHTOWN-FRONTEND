import React from 'react';
import HeroBanner from './Hero-banner/HeroBanner';
import Collections from './Collections/Collections';
import Occasions from './Occasions/Occasions';
import NewArrivals from './NewArrivals/NewArrivals';
import StoryBanner from './StoryBanner/StoryBanner';
import ServiceStrip from './ServiceStrip/ServiceStrip';

export default function HomePage({ products, loading }) {
  return (
    <>
      <HeroBanner />
      <Collections />
      <Occasions />
      <NewArrivals products={products} loading={loading} />
      <StoryBanner />
      <ServiceStrip />
    </>
  );
}

