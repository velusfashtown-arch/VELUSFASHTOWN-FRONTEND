import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import StoreIcon from '../../../../components/store/StoreIcon';
import { api } from '../../../../lib/api';
import { useShop, FREE_SHIPPING_THRESHOLD } from '../../../../context/ShopContext';
import { useAuth } from '../../../../context/AuthContext';
import { OrderSummary } from '../Cart/Cart';

const initialCustomer = { name: '', email: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '' };

const primaryBtn = 'inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';

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
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
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
          onDismiss: () => {
            // The user closed the payment widget without completing it.
            // The order is reserved but still awaiting payment → cancelled screen.
            navigate('/order-cancelled', { state: { order } });
            reject(new Error('Payment was cancelled. Your order is saved and awaiting payment.'));
          },
        },
      });
      razorpay.on('payment.failed', (response) => {
        api.recordPaymentFailure({ orderId: order.id, error: response.error?.description }).catch(() => {});
        navigate('/order-failed', { state: { order } });
        reject(new Error('Payment failed. No charges were made.'));
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
      if (paymentMethod === 'ONLINE') {
        await startOnlinePayment(order);
      }
      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (requestError) { setError(requestError.message || 'Unable to place your order.'); } finally { setLoading(false); }
  }

  return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto min-h-[53vh] w-full max-w-[1530px] px-[7vw] py-[clamp(45px,6vw,90px)] max-[620px]:px-[18px]">
        <div className="mb-10 border-b border-line pb-8">
          <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">SECURE CHECKOUT</p>
          <h1 className="m-0 font-playfair text-[clamp(42px,4.15vw,66px)] font-medium leading-[.95] tracking-[-.055em] text-ink">Complete your <em>order</em></h1>
        </div>

        {isEmpty ? (
          <div className="mx-auto max-w-[610px] border border-line bg-[#fbf7f0] px-6 py-14 text-center md:px-12">
            <h3 className="m-0 font-playfair text-3xl font-medium tracking-[-.04em] text-ink">Your bag is empty.</h3>
            <Link className={`${primaryBtn} mt-6`} to="/shop">CONTINUE SHOPPING</Link>
          </div>
        ) : (
          <form className="grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14" onSubmit={placeOrder}>
            <section className="grid gap-7">
              <div className="border border-line bg-[#fbf7f0] p-5 md:p-7">
                <h2 className="mb-5 mt-0 text-[10px] font-bold tracking-[0.15em] text-ink">DELIVERY DETAILS</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Full name" value={customer.name} onChange={(value) => updateCustomer('name', value)} />
                  <Input label="Email address" type="email" value={customer.email} onChange={(value) => updateCustomer('email', value)} />
                  <Input label="Phone number" type="tel" value={customer.phone} onChange={(value) => updateCustomer('phone', value)} />
                  <Input label="Pincode" value={customer.pincode} onChange={(value) => updateCustomer('pincode', value)} />
                  <Input label="Address" className="md:col-span-2" value={customer.address} onChange={(value) => updateCustomer('address', value)} />
                  <Input label="Landmark (optional)" className="md:col-span-2" required={false} value={customer.landmark} onChange={(value) => updateCustomer('landmark', value)} />
                  <Input label="City" value={customer.city} onChange={(value) => updateCustomer('city', value)} />
                  <Input label="State" value={customer.state} onChange={(value) => updateCustomer('state', value)} />
                </div>
              </div>
              <div className="border border-line bg-[#fbf7f0] p-5 md:p-7">
                <h2 className="mb-5 mt-0 text-[10px] font-bold tracking-[0.15em] text-ink">PAYMENT METHOD</h2>
                <label className={`mb-3 flex cursor-pointer gap-3 border border-line bg-paper p-4 ${paymentMethod === 'COD' ? 'border-terra' : ''}`}><input type="radio" name="paymentMethod" className="mt-0.5 accent-terra" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /><span className="grid gap-1"><b className="text-sm text-ink">Cash on Delivery</b><small className="text-xs leading-5 text-muted">Pay when your saree arrives.</small></span></label>
                <label className={`mb-3 flex cursor-pointer gap-3 border border-line bg-paper p-4 ${paymentMethod === 'ONLINE' ? 'border-terra' : ''}`}><input type="radio" name="paymentMethod" className="mt-0.5 accent-terra" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} /><span className="grid gap-1"><b className="text-sm text-ink">Online payment</b><small className="text-xs leading-5 text-muted">Order is recorded; connect your preferred payment gateway before taking live online payments.</small></span></label>
              </div>
              {error ? <p className="m-0 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              <button className={primaryBtn} type="submit" disabled={loading}>{loading ? 'PLACING YOUR ORDER…' : 'PLACE ORDER'}</button>
            </section>
            <OrderSummary subtotal={subtotal} shipping={shipping} discount={discount} total={total} action={<div className="flex items-center justify-center gap-2 border-t border-line pt-4 text-[10px] font-bold tracking-[0.1em] text-muted"><StoreIcon name="lock" /> Secure checkout</div>} />
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Input({ label, type = 'text', value, onChange, required = true, className = '' }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] font-bold tracking-[0.1em] text-muted">{label}</span>
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 border border-line bg-paper px-3 text-sm text-ink outline-terra" />
    </label>
  );
}
