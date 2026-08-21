import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, useShop } from '../../context/ShopContext';
import StoreIcon from './StoreIcon';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const fallbackImage = '/images/Home/Banner/01.png';
  const image = product.images?.[0] || fallbackImage;
  const isSaved = wishlist.some((item) => item.id === product.id);
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <article className="group relative min-w-0">
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-sand" aria-label={`View ${product.name}`}>
        <img src={image} alt={product.name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]" loading="lazy" onError={(event) => { event.currentTarget.src = fallbackImage; }} />
        <span className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/25 to-transparent opacity-70" />
        {discount ? <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-terra shadow-sm">{discount}% OFF</span> : product.isFeatured ? <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-wine shadow-sm">BESTSELLER</span> : <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1 text-[9px] font-bold tracking-[0.14em] text-ink shadow-sm">NEW</span>}
      </Link>
      <button className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-paper/95 p-2 shadow-sm transition hover:scale-105 ${isSaved ? 'text-terra' : 'text-ink'}`} type="button" aria-label={`Save ${product.name}`} aria-pressed={isSaved} onClick={() => toggleWishlist(product)}><StoreIcon name="heart" /></button>
      <div className="pt-4">
        <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.17em] text-terra">{product.fabric || product.category || "VELU'S EDIT"}</div>
        <Link to={`/product/${product.id}`} className="block min-h-[2.7rem] text-[15px] font-medium leading-[1.35] text-ink no-underline transition-colors hover:text-terra">{product.name}</Link>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1"><b className="text-sm text-ink">{formatPrice(product.price)}</b>{product.compareAtPrice > product.price ? <del className="text-[11px] text-muted">{formatPrice(product.compareAtPrice)}</del> : null}</span>
          <button className="shrink-0 border-0 bg-transparent p-0 text-[9px] font-bold tracking-[0.13em] text-terra transition-colors hover:text-wine disabled:cursor-not-allowed disabled:text-muted" type="button" disabled={!product.stock} onClick={() => addToCart(product)}>{product.stock ? 'ADD TO BAG' : 'SOLD OUT'}</button>
        </div>
      </div>
    </article>
  );
}