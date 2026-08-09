// HomepageSectionRenderer.js
//
// Renders a single database-driven homepage section. Each section returned
// by the storefront /home endpoint has:
//   {
//     _id, type, title,
//     settings: { eyebrow, heading, subheading, image, ctaLabel, ctaUrl, ... },
//     items: [ { title, subtitle, image, url, ... } ],
//     sortOrder, isActive
//   }
//
// Only the section types defined in the backend HOMEPAGE_SECTION_TYPES are
// handled here. Unknown types render nothing, so adding a new section type
// later only requires adding a renderer case — no hard-coded homepage.

import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

function SectionHeading({ eyebrow, title, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  return (
    <div className={`mb-8 ${alignClass}`}>
      {eyebrow ? <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.19em] text-terra">{eyebrow}</p> : null}
      {title ? <h2 className="m-0 font-playfair text-[clamp(30px,3.4vw,52px)] font-medium leading-[0.98] tracking-[-0.04em] text-ink">{title}</h2> : null}
    </div>
  );
}

function SectionShell({ children, className = '' }) {
  return <section className={`mx-auto max-w-[1530px] px-[7vw] py-[clamp(48px,6vw,90px)] ${className}`}>{children}</section>;
}

function imageOf(item) {
  return item?.image || item?.imageUrl || item?.desktopImage || item?.src || '';
}

function AnnouncementBar({ settings }) {
  const text = settings?.text || settings?.announcement || settings?.title || '';
  if (!text) return null;
  return (
    <div className="flex h-8 items-center justify-center bg-wine px-4 text-center text-[9px] font-bold tracking-[0.15em] text-white">
      <span>{text}</span>
    </div>
  );
}

function Hero({ settings }) {
  const image = imageOf(settings);
  const heading = settings?.heading || '';
  const eyebrow = settings?.eyebrow || '';
  const blurb = settings?.subheading || settings?.blurb || '';
  const ctaLabel = settings?.ctaLabel || 'SHOP NOW';
  const ctaUrl = settings?.ctaUrl || '/shop';
  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden text-white">
      {image ? (
        <img src={image} alt="" className="absolute inset-0 -z-[2] h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 -z-[2] bg-gradient-to-br from-wine to-[#3a2720]" />
      )}
      <div className="absolute inset-0 -z-[1] bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <div className="mx-auto w-full max-w-[1530px] px-[7vw]">
        <div className="max-w-[520px]">
          {eyebrow ? <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.19em] text-accent">{eyebrow}</p> : null}
          {heading ? (
            <h1 className="m-0 font-playfair text-[clamp(40px,5vw,72px)] font-medium leading-[0.95] tracking-[-0.05em]">
              {heading}
            </h1>
          ) : null}
          {blurb ? <p className="my-6 max-w-[400px] text-[14px] leading-[1.7] text-white/85">{blurb}</p> : null}
          {ctaLabel ? (
            <Link to={ctaUrl} className="inline-flex items-center gap-2 border-b border-white pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white no-underline">
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Banner({ settings, items = [] }) {
  const banners = Array.isArray(items) && items.length ? items : [settings];
  const bannersList = banners.filter(Boolean);
  if (!bannersList.length) return null;
  return (
    <SectionShell>
      <div className="grid gap-4 md:grid-cols-2">
        {bannersList.map((banner, i) => {
          const image = imageOf(banner);
          const title = banner?.title || '';
          const subtitle = banner?.subtitle || '';
          const ctaLabel = banner?.buttonText || banner?.ctaLabel || 'SHOP NOW';
          const ctaUrl = banner?.buttonUrl || banner?.ctaUrl || '/shop';
          return (
            <Link key={i} to={ctaUrl} className="group relative block min-h-[260px] overflow-hidden bg-sand no-underline">
              {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute inset-x-5 bottom-5 text-white">
                {title ? <strong className="block font-playfair text-2xl">{title}</strong> : null}
                {subtitle ? <em className="mt-1 block text-xs not-italic text-white/85">{subtitle}</em> : null}
                {ctaLabel ? <span className="mt-3 inline-block border-b border-white pb-0.5 text-[10px] font-bold uppercase tracking-[0.15em]">{ctaLabel}</span> : null}
              </span>
            </Link>
          );
        })}
      </div>
    </SectionShell>
  );
}

function CategoryGrid({ items = [] }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <SectionShell className="bg-[#f7f0e6]">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((cat, i) => {
          const image = imageOf(cat);
          const name = cat?.name || cat?.title || `Category ${i + 1}`;
          const slug = cat?.slug || cat?.url || '';
          const url = slug ? `/shop?category=${encodeURIComponent(slug)}` : '/shop';
          return (
            <Link key={i} to={url} className="group block text-center no-underline">
              <div className="aspect-square overflow-hidden rounded-full bg-sand">
                {image ? <img src={image} alt={name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : null}
              </div>
              <span className="mt-3 block text-xs font-bold uppercase tracking-[0.12em] text-ink">{name}</span>
            </Link>
          );
        })}
      </div>
    </SectionShell>
  );
}

function CollectionGrid({ items = [] }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <SectionShell>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((col, i) => {
          const image = imageOf(col);
          const name = col?.name || col?.title || `Collection ${i + 1}`;
          const slug = col?.slug || col?.url || '';
          const url = slug ? `/collection/${encodeURIComponent(slug)}` : '/shop';
          return (
            <Link key={i} to={url} className="group relative block aspect-[4/5] overflow-hidden bg-sand no-underline">
              {image ? <img src={image} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-14 text-white">
                <strong className="font-playfair text-xl">{name}</strong>
              </span>
            </Link>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ProductGrid({ items = [], products = [], title, eyebrow }) {
  const list = Array.isArray(products) && products.length ? products : items;
  if (!Array.isArray(list) || !list.length) return null;
  return (
    <SectionShell>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {list.slice(0, 8).map((product, i) => (
          <div key={product.id || i}><ProductCard product={product} /></div>
        ))}
      </div>
    </SectionShell>
  );
}

function ProductCarousel({ items = [], products = [], title, eyebrow }) {
  const list = Array.isArray(products) && products.length ? products : items;
  if (!Array.isArray(list) || !list.length) return null;
  return (
    <SectionShell>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {list.slice(0, 12).map((product, i) => (
          <div key={product.id || i} className="w-[220px] shrink-0"><ProductCard product={product} /></div>
        ))}
      </div>
    </SectionShell>
  );
}

function ImageText({ settings }) {
  const image = imageOf(settings);
  const title = settings?.title || '';
  const eyebrow = settings?.eyebrow || '';
  const text = settings?.text || settings?.description || '';
  const ctaLabel = settings?.ctaLabel || '';
  const ctaUrl = settings?.ctaUrl || '/shop';
  return (
    <SectionShell>
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden bg-sand">
          {image ? <img src={image} alt="" className="aspect-[4/3] w-full object-cover" /> : <div className="aspect-[4/3] w-full bg-sand" />}
        </div>
        <div>
          {eyebrow ? <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.19em] text-terra">{eyebrow}</p> : null}
          {title ? <h2 className="m-0 font-playfair text-[clamp(28px,3vw,44px)] font-medium leading-[1.02] tracking-[-0.04em] text-ink">{title}</h2> : null}
          {text ? <p className="mt-4 text-sm leading-[1.7] text-muted">{text}</p> : null}
          {ctaLabel ? <Link to={ctaUrl} className="mt-6 inline-block border-b border-ink pb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-ink no-underline">{ctaLabel}</Link> : null}
        </div>
      </div>
    </SectionShell>
  );
}

function Testimonials({ items = [] }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <SectionShell className="bg-[#f7f0e6]">
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((t, i) => (
          <div key={i} className="rounded-xl border border-line bg-paper p-6">
            <div className="mb-3 text-terra">★★★★★</div>
            <p className="text-sm leading-[1.7] text-ink">“{t?.quote || t?.text || t?.content || ''}”</p>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-muted">— {t?.author || t?.name || 'Verified Customer'}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Newsletter({ settings }) {
  const title = settings?.title || 'Stay in the know';
  const subtitle = settings?.subtitle || settings?.text || '';
  return (
    <SectionShell>
      <div className="mx-auto max-w-xl text-center">
        <h2 className="m-0 font-playfair text-[clamp(26px,3vw,40px)] font-medium tracking-[-0.03em] text-ink">{title}</h2>
        {subtitle ? <p className="mt-3 text-sm text-muted">{subtitle}</p> : null}
        <form className="mx-auto mt-6 flex max-w-md border-b border-ink" onSubmit={(e) => e.preventDefault()}>
          <input type="email" required placeholder="Your email address" className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-muted" />
          <button type="submit" className="shrink-0 border-0 bg-transparent p-0 text-[10px] font-bold uppercase tracking-[0.14em] text-terra">Join</button>
        </form>
      </div>
    </SectionShell>
  );
}

function Instagram({ items = [] }) {
  const list = Array.isArray(items) && items.length ? items : [];
  if (!list.length) return null;
  return (
    <SectionShell>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
        {list.map((post, i) => (
          <a key={i} href={post?.url || post?.link || '#'} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden bg-sand">
            {imageOf(post) ? <img src={imageOf(post)} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

function Lookbook({ items = [] }) {
  if (!Array.isArray(items) || !items.length) return null;
  return (
    <SectionShell>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item, i) => (
          <Link key={i} to={item?.url || '/shop'} className="group relative block aspect-[3/4] overflow-hidden bg-sand no-underline">
            {imageOf(item) ? <img src={imageOf(item)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
            {item?.title ? <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs font-bold text-white">{item.title}</span> : null}
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}

function Video({ settings }) {
  const url = settings?.videoUrl || settings?.url || '';
  const image = imageOf(settings);
  if (!url) return null;
  return (
    <SectionShell>
      <div className="relative aspect-video overflow-hidden bg-sand">
        {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
        <video src={url} controls className="relative z-[1] h-full w-full object-cover" poster={image} />
      </div>
    </SectionShell>
  );
}

// ─── Dispatcher ──────────────────────────────────────────────────────
export default function HomepageSectionRenderer({ section, products = [] }) {
  if (!section || section.isActive === false) return null;
  const { type, settings = {}, items = [], title } = section;
  const eyebrow = settings?.eyebrow || '';

  switch (type) {
    case 'AnnouncementBar':
      return <AnnouncementBar settings={settings} />;
    case 'Hero':
      return <Hero settings={settings} />;
    case 'Banner':
      return <Banner settings={settings} items={items} />;
    case 'CategoryGrid':
      return <CategoryGrid items={items} />;
    case 'CollectionGrid':
      return <CollectionGrid items={items} />;
    case 'ProductGrid':
      return <ProductGrid items={items} products={products} title={title} eyebrow={eyebrow} />;
    case 'ProductCarousel':
      return <ProductCarousel items={items} products={products} title={title} eyebrow={eyebrow} />;
    case 'ImageText':
      return <ImageText settings={settings} />;
    case 'Video':
      return <Video settings={settings} />;
    case 'Lookbook':
      return <Lookbook items={items} />;
    case 'Testimonials':
      return <Testimonials items={items} />;
    case 'Newsletter':
      return <Newsletter settings={settings} />;
    case 'Instagram':
      return <Instagram items={items} />;
    default:
      return null;
  }
}
