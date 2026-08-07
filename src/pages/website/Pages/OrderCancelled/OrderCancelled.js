import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import './OrderCancelled.css';

export default function OrderCancelledPage() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="storefront-shell">
      <Header />
      <main className="success-page status-page status-cancelled">
        <div className="success-icon status-icon"><StoreIcon name="refresh" /></div>
        <p className="eyebrow">PAYMENT CANCELLED</p>
        <h1>Payment was<br /><em>cancelled.</em></h1>
        {order ? (
          <p className="success-copy">
            Your order <b>{order.orderNumber}</b> has been <b>secured</b> but is
            still awaiting payment. You can retry the payment at any time — your
            items are already reserved for you.
          </p>
        ) : (
          <p className="success-copy">No payment went through. Your bag is waiting whenever you are ready.</p>
        )}
        <Link className="store-secondary-button full" to="/checkout">RETRY CHECKOUT</Link>
        <Link className="store-primary-button" to="/cart">RETURN TO CART</Link>
      </main>
      <Footer />
    </div>
  );
}
