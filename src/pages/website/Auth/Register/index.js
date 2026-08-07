import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Login/index.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      login(res.data.token, res.data.customer);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="storefront-shell">
      <Header />
      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-heading">
            <p className="eyebrow">JOIN US</p>
            <h1>Create <em>account</em></h1>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Full name</span>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" />
            </label>
            <label className="auth-field">
              <span>Phone (optional)</span>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 6 characters" />
            </label>
            <label className="auth-field">
              <span>Confirm password</span>
              <input type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="Re-enter your password" />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="store-primary-button full" type="submit" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

