import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../../../../lib/auth';
import { authApi } from '../auth.api';

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
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      {/* Mobile brand header (below md) */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-wine to-ink px-5 py-5 md:hidden">
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[140px]" style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Left brand panel (md and up) */}
      <aside className="relative hidden w-[50%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-wine to-ink p-[40px_20px] text-center md:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 20% 30%, rgba(255,253,250,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,253,250,0.06) 0%, transparent 50%), repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,253,250,0.015) 30px, rgba(255,253,250,0.015) 31px)' }}
          aria-hidden="true"
        />
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="relative z-[1] mb-4 h-auto w-[300px]" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="relative z-[1] m-0 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[rgba(255,253,250,0.55)]">Admin Panel</p>
        <p className="relative z-[1] mt-10 max-w-[280px] font-sans text-[13px] italic leading-[1.7] text-[rgba(255,253,250,0.45)]">"Curating timeless fashion for the modern wardrobe."</p>
        <div className="absolute bottom-10 z-[1] flex gap-2">
          <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
          <span className="h-[6px] w-[6px] rounded-full bg-[rgba(255,253,250,0.4)]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 md:p-[40px_3vw]">
        <div className="w-full max-w-[400px] animate-auth-fade-up">
          <p className="mb-2.5 m-0 text-[9px] font-bold uppercase tracking-[0.22em] text-terra">Welcome Back</p>
          <h1 className="m-0 mb-1.5 font-playfair text-[clamp(26px,7vw,36px)] font-medium leading-[1.1] tracking-[-0.04em] text-ink">Sign <em>in</em></h1>
          <p className="m-0 mb-8 text-[13px] leading-[1.5] text-muted">Sign in to manage your store</p>

          <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Email</span>
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@velusfashtown.com"
                  required
                  className="h-[46px] w-full border border-line bg-paper px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-terra focus:shadow-[0_0_0_3px_rgba(167,78,62,0.08)]"
                />
              </div>
            </label>

            <label className="m-0 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Password</span>
              <div className="relative flex items-center">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-[46px] w-full border border-line bg-paper px-3.5 pr-10 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-terra focus:shadow-[0_0_0_3px_rgba(167,78,62,0.08)]"
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 flex h-[46px] w-10 items-center justify-center border-none bg-transparent p-0 text-muted transition-colors duration-200 hover:text-terra"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </label>

            {error && (
              <p className="m-0 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-[11px_14px] text-[12px] leading-[1.4] text-[#a53232]">{error}</p>
            )}

            <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-muted">
                <input type="checkbox" defaultChecked className="m-0 h-4 w-4 cursor-pointer accent-terra" />
                Remember me
              </label>
              <Link to="/admin/forgot-password" className="text-[11px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              className="inline-flex h-12 w-full items-center justify-center border-none bg-terra text-[11px] font-bold uppercase tracking-[0.14em] text-[#fffaf5] transition-all duration-200 hover:bg-wine active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
