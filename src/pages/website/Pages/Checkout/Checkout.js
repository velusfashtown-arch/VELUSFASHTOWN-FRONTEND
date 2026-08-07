import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { api } from '../../../../lib/api';
import { useShop } from '../../../../context/ShopContext';
import { useAuth } from '../../../../context/AuthContext';
import { OrderSummary } from '../Cart/Cart';
import './Checkout.css';

const initialCustomer = { name: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '' };

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useShop();
  const { token, profile } = useAuth();
  const [customer, setCustomer] = useState(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = subtotal >= 4999 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + shipping - discount;
  const isEmpty = !cart.length;

  useEffect(() => {
    if (!profile) return;
    setCustomer((current) => ({
      ...current,
      name: current.name || profile.name || '',
      email: current.email || profile.email || '',
      phone: current.phone || profile.phone || '',
    }));
  }, [profile]);

  const itemRows = useMemo(() => cart.map((item) => ({ productId: item.id, quantity: item.quantity })), [cart]);
  function updateCustomer(field, value) { setCustomer((current) => ({ ...current, [field]: value })); }

  async function startOnlinePayment(order) {
    const [isLoaded, paymentOrderResponse] = await Promise.all([
      loadRazorpay(),
      api.createPaymentOrder(order.id),
    ]);

    if (!isLoaded) throw new Error('Unable to load the payment gateway. Please check your connection and try again.');

    const paymentOrder = paymentOrderResponse.data;
    await new Promise((resolve, reject) => {
      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "VELU'S FASHTOWN",
        description: `Order ${paymentOrder.orderNumber}`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: paymentOrder.customer,
        theme: { color: '#a84032' },
        handler: async (paymentResponse) => {
          try {
            const verification = await api.verifyPayment({ ...paymentResponse, orderId: order.id });
            resolve(verification.data);
          } catch (verificationError) {
            reject(verificationError);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment was cancelled. Your order is saved and awaiting payment.')),
        },
      });
      razorpay.on('payment.failed', (response) => {
        api.recordPaymentFailure({ orderId: order.id, error: response.error?.description }).catch(() => {});
      });
      razorpay.open();
    });
  }

  async function placeOrder(event) {
    event.preventDefault();
    if (isEmpty) return;
    setLoading(true); setError('');
    try {
      const orderResponse = await api.createOrder(token, { customer, items: itemRows, paymentMethod });
      const order = orderResponse.data;
      if (paymentMethod === 'ONLINE') await startOnlinePayment(order);
      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (requestError) { setError(requestError.message || 'Unable to place your order.'); } finally { setLoading(false); }
  }

  return <div className="storefront-shell"><Header /><main className="checkout-page"><div className="page-title"><p className="eyebrow">SECURE CHECKOUT</p><h1>Complete your <em>order</em></h1></div>{isEmpty ? <div className="catalog-empty"><h3>Your bag is empty.</h3><Link className="store-primary-button" to="/shop">CONTINUE SHOPPING</Link></div> : <form className="checkout-layout" onSubmit={placeOrder}><section className="checkout-form"><div className="checkout-section"><h2>DELIVERY DETAILS</h2><div className="form-grid"><Input label="Full name" value={customer.name} onChange={(value) => updateCustomer('name', value)} /><Input label="Email address" type="email" value={customer.email} onChange={(value) => updateCustomer('email', value)} /><Input label="Phone number" type="tel" value={customer.phone} onChange={(value) => updateCustomer('phone', value)} /><Input label="Pincode" value={customer.pincode} onChange={(value) => updateCustomer('pincode', value)} /><Input label="Address" className="span-two" value={customer.address} onChange={(value) => updateCustomer('address', value)} /><Input label="Landmark (optional)" className="span-two" required={false} value={customer.landmark} onChange={(value) => updateCustomer('landmark', value)} /><Input label="City" value={customer.city} onChange={(value) => updateCustomer('city', value)} /><Input label="State" value={customer.state} onChange={(value) => updateCustomer('state', value)} /></div></div><div className="checkout-section"><h2>PAYMENT METHOD</h2><label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}><input type="radio" name="paymentMethod" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /><span><b>Cash on Delivery</b><small>Pay when your saree arrives.</small></span></label><label className={`payment-option ${paymentMethod === 'ONLINE' ? 'selected' : ''}`}><input type="radio" name="paymentMethod" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} /><span><b>Online payment</b><small>Order is recorded; connect your preferred payment gateway before taking live online payments.</small></span></label></div>{error ? <p className="checkout-error">{error}</p> : null}<button className="store-primary-button full checkout-submit" type="submit" disabled={loading}>{loading ? 'PLACING YOUR ORDER…' : `PLACE ORDER`}</button></section><OrderSummary subtotal={subtotal} shipping={shipping} discount={discount} total={total} action={<div className="checkout-security"><StoreIcon name="lock" /> Secure checkout</div>} /></form>}</main><Footer /></div>;
}

function Input({ label, type = 'text', value, onChange, required = true, className = '' }) { return <label className={`checkout-input ${className}`}><span>{label}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
