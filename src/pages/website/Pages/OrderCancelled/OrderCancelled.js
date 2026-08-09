import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';

export default function OrderCancelledPage() {
  const { state } = useLocation();
  const order = state?.order;

const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
  const secondaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-ink bg-transparent px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-ink no-underline transition hover:bg-ink hover:text-paper';
  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto flex min-h-[58vh] max-w-[720px] flex-col items-center px-5 py-[clamp(70px,10vw,140px)] text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#f9f1e3] text-[#b47c2e]"><StoreIcon name="refresh" /></div>
        <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">PAYMENT CANCELLED</p>
        <h1 className="m-0 font-playfair text-[clamp(42px,5vw,66px)] font-medium leading-[.94] tracking-[-.055em] text-ink">Payment was<br /><em>cancelled.</em></h1>
        {order ? (
          <p className="mx-auto mb-6 mt-6 max-w-lg text-sm leading-6 text-muted">
            Your order <b>{order.orderNumber}</b> has been <b>secured</b> but is
            still awaiting payment. You can retry the payment at any time — your
            items are already reserved for you.
          </p>
        ) : (
          <p className="mx-auto mb-6 mt-6 max-w-lg text-sm leading-6 text-muted">No payment went through. Your bag is waiting whenever you are ready.</p>
        )}
        <Link className={`${secondaryBtn} mb-3 w-full`} to="/checkout">RETRY CHECKOUT</Link>
        <Link className={primaryBtn} to="/cart">RETURN TO CART</Link>
      </main>
      <Footer />
    </div>
  );
}
