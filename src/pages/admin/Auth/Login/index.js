import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../../../../lib/auth';
import { authApi } from '../auth.api';
import AdminInput from '../../Common/Form/Input';
import { adminBtnPrimary } from '../../Common/buttonClasses';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const token = res?.data?.token || '';
      if (!token) {
        throw new Error('No access token received from server');
      }
      setToken(token);
      nav('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-admin-bg px-4 py-10 sm:px-6">
      {/* Warm textured background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 10%, rgba(79,70,229,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 90%, rgba(79,70,229,0.08) 0%, transparent 50%), linear-gradient(180deg, #f6f7f9 0%, #eef0f3 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(0,0,0,0.015) 30px, rgba(0,0,0,0.015) 31px)' }}
        aria-hidden="true"
      />

      <div className="relative z-[1] w-full max-w-[420px] animate-auth-fade-up">
        {/* Brand mark */}
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[150px]" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-admin-muted">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-admin-border bg-white p-7 shadow-modal sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="m-0 font-playfair text-[28px] font-semibold leading-tight tracking-[-0.03em] text-admin-text sm:text-[32px]">
              Welcome <em>back</em>
            </h1>
            <p className="m-0 mt-2 text-[13px] leading-relaxed text-admin-muted">Sign in to manage your store</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <AdminInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velusfashtown.com"
              required
            />

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-admin-muted">Password</span>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-md border border-admin-border bg-white py-2.5 pl-3 pr-10 font-sans text-[13px] text-admin-text outline-none transition-colors focus:border-admin-primary"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-full w-10 items-center justify-center border-none bg-transparent p-0 text-admin-muted transition-colors duration-200 hover:text-admin-primary"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="m-0 rounded-md border border-admin-danger/20 bg-admin-danger-light p-[11px_14px] text-[12px] leading-[1.4] text-admin-danger">{error}</p>
            )}

            <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-admin-muted">
                <input type="checkbox" defaultChecked className="m-0 h-4 w-4 cursor-pointer accent-admin-primary" />
                Remember me
              </label>
              <Link to="/admin/forgot-password" className="text-[11px] font-semibold text-admin-primary no-underline transition-colors duration-200 hover:text-admin-primary-hover hover:underline">
                Forgot password?
              </Link>
            </div>

            <button className={`${adminBtnPrimary} w-full`} type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-7 text-center text-[11px] leading-relaxed text-admin-muted">
          &copy; {new Date().getFullYear()} Velu's Fashtown &mdash; Curating timeless fashion.
        </p>
      </div>
    </div>
  );
}