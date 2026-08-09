import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { formatPrice } from '../../../../context/ShopContext';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;
  const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
  return <div className="overflow-hidden bg-paper"><Header /><main className="mx-auto flex min-h-[58vh] max-w-[720px] flex-col items-center px-5 py-[clamp(70px,10vw,140px)] text-center"><div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#e7f0e4] text-[#2e7040]"><StoreIcon name="check" /></div><p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">ORDER CONFIRMED</p><h1 className="m-0 font-playfair text-[clamp(42px,5vw,66px)] font-medium leading-[.94] tracking-[-.055em] text-ink">Thank you for<br /><em>shopping with us.</em></h1>{order ? <><p className="mx-auto mb-6 mt-6 max-w-lg text-sm leading-6 text-muted">Your order <b>{order.orderNumber}</b> has been placed. We will contact you at <b>{order.customer.phone}</b> with delivery updates.</p><div className="mb-7 grid min-w-[min(100%,330px)] gap-2 border border-line bg-[#fbf7f0] px-7 py-5"><span className="text-[10px] font-bold tracking-[0.13em] text-muted">ORDER TOTAL</span><b className="text-xl text-ink">{formatPrice(order.total)}</b><span className="text-[10px] font-bold tracking-[0.13em] text-muted">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online payment pending'}</span></div></> : <p className="mx-auto mb-6 mt-6 max-w-lg text-sm leading-6 text-muted">Your order journey starts here. Explore our latest sarees.</p>}<Link className={primaryBtn} to="/shop?category=Sarees">CONTINUE SHOPPING</Link></main><Footer /></div>;
}
