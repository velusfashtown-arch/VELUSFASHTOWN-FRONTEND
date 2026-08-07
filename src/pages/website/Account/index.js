import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useAuth } from '../../../context/AuthContext';
import { formatPrice } from '../../../context/ShopContext';
import { api } from '../../../lib/api';
import '../Auth/Login/index.css';
import './index.css';

const emptyAddress = { name: '', phone: '', address: '', landmark: '', city: '', state: '', pincode: '', type: 'home', isDefault: false };

function Field({ label, value, onChange, className = '', type = 'text', required = true }) {
  return (
    <label className={`checkout-input ${className}`}>
      <span>{label}</span>
      <input type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} />
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
    <div className="storefront-shell">
      <Header />
      <main className="account-page">
        <p className="eyebrow">MY ACCOUNT</p>
        <h1>Hello, <em>{fullProfile?.name || profile?.name || 'there'}</em></h1>

        <div className="account-tabs">
          <button type="button" className={`account-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>PROFILE</button>
          <button type="button" className={`account-tab ${tab === 'addresses' ? 'active' : ''}`} onClick={() => setTab('addresses')}>ADDRESSES</button>
          <button type="button" className={`account-tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>ORDERS</button>
        </div>

        {message ? <p className="auth-success">✓ {message}</p> : null}
        {error ? <p className="auth-error">{error}</p> : null}

        {tab === 'profile' && (
          <form className="account-card" onSubmit={saveProfile}>
            <h2>PROFILE DETAILS</h2>
            <div className="account-form-grid">
              <Field label="Full name" value={profileForm.name} onChange={(v) => setProfileForm((f) => ({ ...f, name: v }))} />
              <Field label="Phone number" type="tel" value={profileForm.phone} onChange={(v) => setProfileForm((f) => ({ ...f, phone: v }))} />
              <Field label="Email address" className="span-two" value={fullProfile?.email || profile?.email || ''} onChange={() => {}} required={false} />
            </div>
            <button className="store-primary-button" type="submit" disabled={saving} style={{ marginTop: 18 }}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </form>
        )}

        {tab === 'addresses' && (
          <div>
            {addresses.length ? (
              <div className="account-address-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`account-address-card ${addr.isDefault ? 'default' : ''}`}>
                    {addr.isDefault ? <span className="account-address-badge">DEFAULT</span> : null}
                    <p className="name">{addr.name} · {addr.phone}</p>
                    <p>{addr.address}{addr.landmark ? `, ${addr.landmark}` : ''}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                    <div className="account-address-actions">
                      <button type="button" onClick={() => openEditAddress(addr)}>EDIT</button>
                      <button type="button" className="danger" onClick={() => removeAddress(addr.id)}>REMOVE</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="account-empty">No saved addresses yet.</p>
            )}

            {editingAddress ? (
              <form className="account-card" onSubmit={submitAddress}>
                <h2>{editingAddress === 'new' ? 'ADD ADDRESS' : 'EDIT ADDRESS'}</h2>
                <div className="account-form-grid">
                  <Field label="Full name" value={addressForm.name} onChange={(v) => setAddressForm((f) => ({ ...f, name: v }))} />
                  <Field label="Phone number" type="tel" value={addressForm.phone} onChange={(v) => setAddressForm((f) => ({ ...f, phone: v }))} />
                  <Field label="Pincode" value={addressForm.pincode} onChange={(v) => setAddressForm((f) => ({ ...f, pincode: v }))} />
                  <Field label="City" value={addressForm.city} onChange={(v) => setAddressForm((f) => ({ ...f, city: v }))} />
                  <Field label="State" value={addressForm.state} onChange={(v) => setAddressForm((f) => ({ ...f, state: v }))} />
                  <Field label="Address" className="span-two" value={addressForm.address} onChange={(v) => setAddressForm((f) => ({ ...f, address: v }))} />
                  <Field label="Landmark (optional)" className="span-two" required={false} value={addressForm.landmark} onChange={(v) => setAddressForm((f) => ({ ...f, landmark: v }))} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
                  <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))} />
                  Set as default address
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button className="store-primary-button" type="submit" disabled={saving}>{saving ? 'SAVING...' : 'SAVE ADDRESS'}</button>
                  <button type="button" className="store-secondary-button" onClick={() => setEditingAddress(null)}>CANCEL</button>
                </div>
              </form>
            ) : (
              <button type="button" className="store-secondary-button" onClick={openNewAddress}>+ ADD NEW ADDRESS</button>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="account-card">
            <h2>ORDER HISTORY</h2>
            {ordersLoading ? (
              <p className="account-empty">Loading your orders...</p>
            ) : orders.length ? (
              <div className="account-orders-list">
                {orders.map((order) => (
                  <div className="account-order-row" key={order.id}>
                    <div className="account-order-head">
                      <b>{order.orderNumber}</b>
                      <span className="account-order-status">{order.status}</span>
                    </div>
                    <p className="account-order-items">
                      {order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'} · {formatPrice(order.total)} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    {order.trackingNumber ? (
                      <p className="account-order-tracking">Tracking: {order.courierName} — {order.trackingNumber}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="account-empty">
                <p style={{ margin: '0 0 10px' }}>No orders yet.</p>
                <Link className="store-primary-button" to="/shop">START SHOPPING</Link>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
