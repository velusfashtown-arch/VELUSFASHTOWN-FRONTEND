import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

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
<div className="overflow-hidden bg-paper">
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-cream p-[60px_20px_80px]">
        <div className="w-full max-w-[420px] border border-line bg-paper p-[45px_35px_40px] max-[620px]:p-[35px_22px_30px]">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">JOIN US</p>
            <h1 className="m-0 font-playfair text-[clamp(32px,5vw,42px)] font-medium leading-none tracking-[-0.05em] text-ink">Create <em>account</em></h1>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Full name</span>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
            </label>
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Email</span>
              <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
            </label>
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Phone (optional)</span>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
            </label>
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Password</span>
              <input type="password" required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 6 characters" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
            </label>
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Confirm password</span>
              <input type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)} placeholder="Re-enter your password" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
            </label>
            {error ? <p className="m-0 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-2.5 text-center text-[12px] text-[#a53232]">{error}</p> : null}
            <button className="inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted" type="submit" disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
            <p className="m-0 mt-1 text-center text-[12px] text-muted">
              Already have an account? <Link to="/login" className="font-bold text-terra no-underline hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

