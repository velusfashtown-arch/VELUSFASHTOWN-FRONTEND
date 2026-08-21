import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../auth.api';
import AdminInput from '../../Common/Form/Input';
import { adminBtnPrimary } from '../../Common/buttonClasses';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      setSuccess(res?.message || 'If this email is registered, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-10 sm:px-6">
      {/* Warm textured background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 10%, rgba(167,78,62,0.10) 0%, transparent 45%), radial-gradient(circle at 85% 90%, rgba(108,36,36,0.10) 0%, transparent 50%), linear-gradient(180deg, #f9f5ee 0%, #ece2d4 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(47,31,25,0.015) 30px, rgba(47,31,25,0.015) 31px)' }}
        aria-hidden="true"
      />

      <div className="relative z-[1] w-full max-w-[420px] animate-auth-fade-up">
        {/* Brand mark */}
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[150px]" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[rgba(47,31,25,0.08)] bg-paper p-7 shadow-[0_20px_50px_rgba(47,31,25,0.10)] sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="m-0 font-playfair text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">
              Forgot <em>password?</em>
            </h1>
            <p className="m-0 mt-2 text-[13px] leading-relaxed text-muted">Enter your email and we&apos;ll send you a reset link.</p>
          </div>

          {success ? (
            <div className="flex flex-col gap-5">
              <p className="m-0 rounded-md border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-[11px_14px] text-[12px] leading-[1.4] text-[#2a7a3b]">{success}</p>
              <Link to="/admin" className="text-center text-[12px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <AdminInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velusfashtown.com"
                required
              />

              {error && (
                <p className="m-0 rounded-md border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-[11px_14px] text-[12px] leading-[1.4] text-[#a53232]">{error}</p>
              )}

              <button className={`${adminBtnPrimary} w-full`} type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link to="/admin" className="group mx-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-muted no-underline transition-colors duration-200 hover:text-terra">
                <svg className="h-[14px] w-[14px] transition-transform duration-200 group-hover:-translate-x-[3px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to login
              </Link>
            </form>
          )}
        </div>

        <p className="mt-7 text-center text-[11px] leading-relaxed text-muted">
          &copy; {new Date().getFullYear()} Velu&apos;s Fashtown &mdash; Curating timeless fashion.
        </p>
      </div>
    </div>
  );
}
