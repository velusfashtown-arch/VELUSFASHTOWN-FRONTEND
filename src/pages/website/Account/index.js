import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuth } from '../../../context/AuthContext';
import { formatPrice } from '../../../context/ShopContext';
import { api } from '../../../lib/api';
import { scrollToTop } from '../../../utils/scrollToTop';

const emptyAddress = { name: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '', type: 'home', isDefault: false };

const primaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted';
const secondaryBtn = 'inline-flex min-h-[46px] items-center justify-center border border-ink bg-transparent px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-ink no-underline transition hover:bg-ink hover:text-paper';

function Field({ label, value, onChange, className = '', type = 'text', required = true }) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[10px] font-bold tracking-[0.1em] text-muted">{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 border border-line bg-paper px-3 text-sm text-ink outline-terra" />
    </label>
  );
}

export default function AccountPage() {
  const { token, profile, updateProfile: setCachedProfile } = useAuth();
  const [tab, setTab] = useState('profile');
  const [fullProfile, setFullProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null); // null | 'new' | address object
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(() => {
    api.getProfile(token)
      .then((res) => {
        setFullProfile(res.data);
        setProfileForm({ name: res.data?.name || '', phone: res.data?.phone || '' });
        setAddresses(res.data?.addresses || []);
      })
      .catch(() => {});
  }, [token]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    setOrdersLoading(true);
    api.myOrders(token)
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [token]);

  function flash(type, text) {
    if (type === 'error') { setError(text); setMessage(''); } else { setMessage(text); setError(''); }
    window.setTimeout(() => { setMessage(''); setError(''); }, 3000);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile(token, profileForm);
      setCachedProfile({ ...profile, name: res.data.name, phone: res.data.phone });
      flash('success', 'Profile updated');
    } catch (err) {
      flash('error', err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  }

  function openNewAddress() {
    setAddressForm(emptyAddress);
    setEditingAddress('new');
  }

  function openEditAddress(addr) {
    setAddressForm({
      name: addr.name || '', phone: addr.phone || '', address: addr.address || '',
      landmark: addr.landmark || '', city: addr.city || '', state: addr.state || '',
      pincode: addr.pincode || '', type: addr.type || 'home', isDefault: Boolean(addr.isDefault),
    });
    setEditingAddress(addr);
  }

  async function submitAddress(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = editingAddress === 'new'
        ? await api.addAddress(token, addressForm)
        : await api.updateAddress(token, editingAddress.id, addressForm);
      setAddresses(res.data?.addresses || []);
      setEditingAddress(null);
      flash('success', 'Address saved');
    } catch (err) {
      flash('error', err.message || 'Could not save address');
    } finally {
      setSaving(false);
    }
  }

  async function removeAddress(addressId) {
    if (!window.confirm('Remove this address?')) return;
    try {
      const res = await api.deleteAddress(token, addressId);
      setAddresses(res.data?.addresses || []);
      flash('success', 'Address removed');
    } catch (err) {
      flash('error', err.message || 'Could not remove address');
    }
  }

return (
    <div className="overflow-hidden bg-paper">
      <Header />
      <main className="mx-auto max-w-[1000px] px-5 py-[45px_20px_90px]">
        <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">MY ACCOUNT</p>
        <h1 className="m-0 font-playfair text-[clamp(42px,4.15vw,66px)] font-medium leading-[.95] tracking-[-.055em] text-ink">Hello, <em>{fullProfile?.name || profile?.name || 'there'}</em></h1>

        <div className="mb-8 mt-7 flex gap-2 overflow-x-auto border-b border-line">
          <button type="button" className={`mr-6 cursor-pointer border-0 bg-transparent p-[12px_4px] text-[11px] font-bold whitespace-nowrap tracking-[0.1em] ${tab === 'profile' ? 'border-b-2 border-terra text-ink' : 'text-muted'}`} onClick={() => { setTab('profile'); scrollToTop(); }}>PROFILE</button>
          <button type="button" className={`mr-6 cursor-pointer border-0 bg-transparent p-[12px_4px] text-[11px] font-bold whitespace-nowrap tracking-[0.1em] ${tab === 'addresses' ? 'border-b-2 border-terra text-ink' : 'text-muted'}`} onClick={() => { setTab('addresses'); scrollToTop(); }}>ADDRESSES</button>
          <button type="button" className={`mr-6 cursor-pointer border-0 bg-transparent p-[12px_4px] text-[11px] font-bold whitespace-nowrap tracking-[0.1em] ${tab === 'orders' ? 'border-b-2 border-terra text-ink' : 'text-muted'}`} onClick={() => { setTab('orders'); scrollToTop(); }}>ORDERS</button>
        </div>

        {message ? <p className="m-0 mb-5 border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-2.5 text-center text-[12px] text-[#2a7a3b]">✓ {message}</p> : null}
        {error ? <p className="m-0 mb-5 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-2.5 text-center text-[12px] text-[#a53232]">{error}</p> : null}

        {tab === 'profile' && (
          <form className="mb-5 border border-line bg-paper p-6" onSubmit={saveProfile}>
            <h2 className="m-0 mb-4 text-[11px] font-bold tracking-[0.12em] text-ink">PROFILE DETAILS</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full name" value={profileForm.name} onChange={(v) => setProfileForm((f) => ({ ...f, name: v }))} />
              <Field label="Phone number" type="tel" value={profileForm.phone} onChange={(v) => setProfileForm((f) => ({ ...f, phone: v }))} />
              <Field label="Email address" className="col-span-1 md:col-span-2" value={fullProfile?.email || profile?.email || ''} onChange={() => {}} required={false} />
            </div>
            <button className={`${primaryBtn} mt-[18px]`} type="submit" disabled={saving}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>
        )}

        {tab === 'addresses' && (
          <div>
            {addresses.length ? (
              <div className="mb-5 grid gap-3.5">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`relative border p-4 ${addr.isDefault ? 'border-terra' : 'border-line'}`}>
                    {addr.isDefault ? <span className="mb-2 inline-block border border-terra p-[2px_8px] text-[9px] font-bold tracking-[0.08em] text-terra">DEFAULT</span> : null}
                    <p className="m-0 mb-1 font-bold text-ink">{addr.name} · {addr.phone}</p>
                    <p className="m-0 text-[13px] leading-[1.5] text-muted">{addr.address}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
                    <p className="m-0 text-[13px] leading-[1.5] text-muted">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <div className="mt-3 flex gap-3.5">
                      <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-[11px] font-bold tracking-[0.06em] text-terra" onClick={() => openEditAddress(addr)}>EDIT</button>
                      <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-[11px] font-bold tracking-[0.06em] text-[#a53232]" onClick={() => removeAddress(addr.id)}>REMOVE</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-[30px_0] text-center text-[13px] text-muted">No saved addresses yet.</p>
            )}

            {editingAddress ? (
              <form className="mb-5 border border-line bg-paper p-6" onSubmit={submitAddress}>
                <h2 className="m-0 mb-4 text-[11px] font-bold tracking-[0.12em] text-ink">{editingAddress === 'new' ? 'ADD ADDRESS' : 'EDIT ADDRESS'}</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Full name" value={addressForm.name} onChange={(v) => setAddressForm((f) => ({ ...f, name: v }))} />
                  <Field label="Phone number" type="tel" value={addressForm.phone} onChange={(v) => setAddressForm((f) => ({ ...f, phone: v }))} />
                  <Field label="Pincode" value={addressForm.pincode} onChange={(v) => setAddressForm((f) => ({ ...f, pincode: v }))} />
                  <Field label="City" value={addressForm.city} onChange={(v) => setAddressForm((f) => ({ ...f, city: v }))} />
                  <Field label="State" value={addressForm.state} onChange={(v) => setAddressForm((f) => ({ ...f, state: v }))} />
                  <Field label="Address" className="col-span-1 md:col-span-2" value={addressForm.address} onChange={(v) => setAddressForm((f) => ({ ...f, address: v }))} />
                  <Field label="Landmark (optional)" className="col-span-1 md:col-span-2" required={false} value={addressForm.landmark} onChange={(v) => setAddressForm((f) => ({ ...f, landmark: v }))} />
                </div>
                <label className="mt-[14px] flex items-center gap-2 text-[12px] text-muted">
                  <input type="checkbox" className="accent-terra" checked={addressForm.isDefault} onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))} />
                  Set as default address
                </label>
                <div className="mt-[18px] flex gap-2.5">
                  <button className={primaryBtn} type="submit" disabled={saving}>{saving ? 'SAVING...' : 'SAVE ADDRESS'}</button>
                  <button type="button" className={secondaryBtn} onClick={() => setEditingAddress(null)}>CANCEL</button>
                </div>
              </form>
            ) : (
              <button type="button" className={secondaryBtn} onClick={openNewAddress}>+ ADD NEW ADDRESS</button>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="mb-5 border border-line bg-paper p-6">
            <h2 className="m-0 mb-4 text-[11px] font-bold tracking-[0.12em] text-ink">ORDER HISTORY</h2>
            {ordersLoading ? (
              <p className="p-[30px_0] text-center text-[13px] text-muted">Loading your orders...</p>
            ) : orders.length ? (
              <div className="grid gap-3.5">
                {orders.map((order) => (
                  <div className="border border-line p-4" key={order.id}>
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2.5">
                      <b className="text-[13px] text-ink">{order.orderNumber}</b>
                      <span className="inline-block bg-cream p-[3px_9px] text-[9px] font-bold tracking-[0.08em] text-ink">{order.status}</span>
                    </div>
                    <p className="m-0 mb-2 text-[12px] text-muted">
                      {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'} · {formatPrice(order.total)} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    {order.trackingNumber ? (
                      <p className="m-0 text-[12px] text-terra">Tracking: {order.courierName} — {order.trackingNumber}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-[30px_0] text-center text-[13px] text-muted">
                <p className="mb-[10px]">No orders yet.</p>
                <Link className={`${primaryBtn} mt-2`} to="/shop">START SHOPPING</Link>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
