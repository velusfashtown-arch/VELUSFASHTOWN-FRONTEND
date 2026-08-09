import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';

export default function OrderFailedPage() {
  const { state } = useLocation();
  const order = state?.order;

const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
  const secondaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-ink bg-transparent px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-ink no-underline transition hover:bg-ink hover:text-paper';
  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto flex min-h-[58vh] max-w-[720px] flex-col items-center px-5 py-[clamp(70px,10vw,140px)] text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#fbe6e4] text-[#a53232]"><StoreIcon name="close" /></div>
        <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">PAYMENT FAILED</p>
        <h1 className="m-0 font-playfair text-[clamp(42px,5vw,66px)] font-medium leading-[.94] tracking-[-.055em] text-ink">Payment didn't<br /><em>go through.</em></h1>
        <p className="mx-auto mb-6 mt-6 max-w-lg text-sm leading-6 text-muted">
          {order ? (
            <>Your order <b>{order.orderNumber}</b> was not charged. No money was
            deducted. Please check your payment details and try again, or choose
            Cash on Delivery.</>
          ) : (
            <>No money was deducted from your account. Please review your payment
            details and try again, or choose Cash on Delivery at checkout.</>
          )}
        </p>
        <Link className={`${secondaryBtn} mb-3 w-full`} to="/checkout">RETRY CHECKOUT</Link>
        <Link className={primaryBtn} to="/shop">CONTINUE SHOPPING</Link>
      </main>
      <Footer />
    </div>
  );
}

