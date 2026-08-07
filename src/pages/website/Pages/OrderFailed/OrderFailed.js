import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import './OrderFailed.css';

export default function OrderFailedPage() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="storefront-shell">
      <Header />
      <main className="success-page status-page status-failed">
        <div className="success-icon status-icon"><StoreIcon name="close" /></div>
        <p className="eyebrow">PAYMENT FAILED</p>
        <h1>Payment didn't<br /><em>go through.</em></h1>
        <p className="success-copy">
          {order ? (
            <>Your order <b>{order.orderNumber}</b> was not charged. No money was
            deducted. Please check your payment details and try again, or choose
            Cash on Delivery.</>
          ) : (
            <>No money was deducted from your account. Please review your payment
            details and try again, or choose Cash on Delivery at checkout.</>
          )}
        </p>
        <Link className="store-secondary-button full" to="/checkout">RETRY CHECKOUT</Link>
        <Link className="store-primary-button" to="/shop">CONTINUE SHOPPING</Link>
      </main>
      <Footer />
    </div>
  );
}

