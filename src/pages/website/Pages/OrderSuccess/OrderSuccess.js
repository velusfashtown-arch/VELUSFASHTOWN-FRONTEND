import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { formatPrice } from '../../../../context/ShopContext';
import './OrderSuccess.css';

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;
  return <div className="storefront-shell"><Header /><main className="success-page"><div className="success-icon"><StoreIcon name="check" /></div><p className="eyebrow">ORDER CONFIRMED</p><h1>Thank you for<br /><em>shopping with us.</em></h1>{order ? <><p className="success-copy">Your order <b>{order.orderNumber}</b> has been placed. We will contact you at <b>{order.customer.phone}</b> with delivery updates.</p><div className="success-order-card"><span>ORDER TOTAL</span><b>{formatPrice(order.total)}</b><span>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online payment pending'}</span></div></> : <p className="success-copy">Your order journey starts here. Explore our latest sarees.</p>}<Link className="store-primary-button" to="/shop?category=Sarees">CONTINUE SHOPPING</Link></main><Footer /></div>;
}

