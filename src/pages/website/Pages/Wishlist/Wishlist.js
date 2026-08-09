import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import ProductCard from '../../../../components/store/ProductCard';
import { useShop } from '../../../../context/ShopContext';

export default function WishlistPage() {
  const { wishlist } = useShop();
  const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
  return <div className="overflow-hidden bg-paper"><Header /><main className="mx-auto min-h-[53vh] w-full max-w-page px-[7vw] py-[clamp(65px,8vw,120px)] max-[620px]:px-[18px] max-[620px]:py-[61px]"><p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">SAVED FOR LATER</p><h1 className="m-0 font-playfair text-[clamp(42px,4.15vw,66px)] font-medium leading-[.95] tracking-[-.055em] text-ink">Your <em>wishlist</em></h1>{wishlist.length ? <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4">{wishlist.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12"><h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">Your wishlist is waiting for something beautiful.</h3><p className="mx-auto mb-6 mt-3 max-w-md text-sm leading-6 text-muted">Save the sarees you love and return to them whenever you are ready.</p><Link className={primaryBtn} to="/shop?category=Sarees">EXPLORE SAREES</Link></div>}</main><Footer /></div>;
}

