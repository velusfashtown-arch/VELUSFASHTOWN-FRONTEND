import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { formatPrice, useShop, FREE_SHIPPING_THRESHOLD } from '../../../../context/ShopContext';

const primaryBtn = 'inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';

export default function CartPage() {
  const { cart, subtotal, updateQuantity, removeFromCart } = useShop();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const discount = subtotal >= 4999 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + shipping - discount;
  const fallbackImage = '/images/Home/Banner/01.png';

  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto min-h-[53vh] w-full max-w-[1530px] px-[7vw] py-[clamp(45px,6vw,90px)] max-[620px]:px-[18px]">
        <div className="mb-10 border-b border-line pb-8">
          <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">YOUR SELECTION</p>
          <h1 className="m-0 font-playfair text-[clamp(42px,4.15vw,66px)] font-medium leading-[.95] tracking-[-.055em] text-ink">Shopping <em>bag</em></h1>
        </div>

        {cart.length ? (
          <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
            <section className="divide-y divide-line border-y border-line">
              {cart.map((item) => (
                <article className="grid grid-cols-[112px_minmax(0,1fr)_auto] gap-5 py-5 max-[620px]:grid-cols-[92px_minmax(0,1fr)] max-[620px]:gap-3" key={`${item.id}-${item.variantId || 'base'}`}>
                  <Link to={`/product/${item.id}`} className="block aspect-[4/5] overflow-hidden bg-sand"><img src={item.images?.[0] || fallbackImage} alt={item.name} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.src = fallbackImage; }} /></Link>
                  <div className="flex min-w-0 flex-col items-start">
                    <p className="mb-1 mt-0 text-[9px] font-bold tracking-[0.15em] text-terra">{item.fabric || item.category || 'SAREE'}</p>
                    <Link to={`/product/${item.id}`} className="text-[15px] font-medium leading-5 text-ink no-underline hover:text-terra">{item.name}</Link>
                    {item.variantLabel && <small className="-mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">{item.variantLabel}</small>}
                    <b className="mt-2 text-sm text-ink">{formatPrice(item.price)}</b>
                    <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                      <div className="inline-flex h-9 items-center border border-line bg-paper">
                        <button type="button" aria-label="Reduce quantity" className="grid h-full w-9 place-items-center border-0 bg-transparent p-2 text-ink disabled:text-muted" onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}><StoreIcon name="minus" /></button>
                        <b className="grid min-w-[28px] place-items-center text-xs text-ink">{item.quantity}</b>
                        <button type="button" aria-label="Increase quantity" className="grid h-full w-9 place-items-center border-0 bg-transparent p-2 text-ink disabled:text-muted" onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}><StoreIcon name="plus" /></button>
                      </div>
                      <button className="inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[9px] font-bold tracking-[0.1em] text-muted hover:text-terra" type="button" onClick={() => removeFromCart(item.id, item.variantId)}><StoreIcon name="trash" /> REMOVE</button>
                    </div>
                  </div>
                  <strong className="text-right text-sm text-ink max-[620px]:col-start-2 max-[620px]:mt-[-29px]">{formatPrice(item.price * item.quantity)}</strong>
                </article>
              ))}
            </section>
            <OrderSummary subtotal={subtotal} shipping={shipping} discount={discount} total={total} action={<Link className={primaryBtn} to="/checkout">PROCEED TO CHECKOUT</Link>} />
          </div>
        ) : (
          <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12">
            <h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">Your bag is waiting for something beautiful.</h3>
            <p className="mx-auto mb-6 mt-3 max-w-md text-sm leading-6 text-muted">Explore our curated saree collection and add the styles you love.</p>
            <Link className={primaryBtn} to="/shop?category=Sarees">SHOP SAREES</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export function OrderSummary({ subtotal, shipping, discount, total, action }) {
  return (
    <aside className="border border-line bg-[#fbf7f0] p-6 lg:sticky lg:top-24">
      <h2 className="mb-5 mt-0 border-b border-line pb-4 text-[10px] font-bold tracking-[0.16em] text-ink">ORDER SUMMARY</h2>
      <div className="mb-3 flex items-center justify-between gap-4 text-xs text-muted"><span>Subtotal</span><b className="text-ink">{formatPrice(subtotal)}</b></div>
      <div className="mb-3 flex items-center justify-between gap-4 text-xs text-muted"><span>Shipping</span><b className="text-ink">{shipping ? formatPrice(shipping) : 'FREE'}</b></div>
      {discount ? <div className="mb-3 flex items-center justify-between gap-4 text-xs text-terra"><span>Festive savings</span><b className="text-terra">− {formatPrice(discount)}</b></div> : null}
      <div className="mb-0 mt-5 flex items-center justify-between gap-4 border-t border-line pt-4 text-sm font-bold text-ink"><span>Total</span><b className="text-base">{formatPrice(total)}</b></div>
      <small className="mb-5 mt-2 block text-[10px] text-muted">Inclusive of all taxes</small>
      {action}
    </aside>
  );
}
