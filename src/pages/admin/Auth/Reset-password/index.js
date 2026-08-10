import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../auth.api';

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', className: 'weak', bars: 1 };
  if (score <= 3) return { label: 'Medium', className: 'medium', bars: 2 };
  return { label: 'Strong', className: 'strong', bars: 3 };
}

const RADIAL_PATTERN = 'radial-gradient(circle at 20% 30%, rgba(255,253,250,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,253,250,0.06) 0%, transparent 50%), repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,253,250,0.015) 30px, rgba(255,253,250,0.015) 31px)';

export default function AdminResetPasswordPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const strength = getStrength(password);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({ resetToken: token || '', password });
      setSuccess(res?.message || 'Password has been reset successfully.');
      setTimeout(() => nav('/admin'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const strengthColor = strength.className === 'weak' ? 'bg-[#c5221f]' : strength.className === 'medium' ? 'bg-[#e3742a]' : 'bg-[#2a7a3b]';

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col bg-paper md:flex-row">
        {/* Mobile brand header (below md) */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-wine to-ink px-5 py-5 md:hidden">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[140px]" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>

        <aside className="relative hidden w-[50%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-wine to-ink p-[40px_20px] text-center md:flex">
          <div className="pointer-events-none absolute inset-0" style={{ background: RADIAL_PATTERN }} aria-hidden="true" />
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="relative z-[1] mb-4 h-auto w-[300px]" style={{ filter: 'brightness(0) invert(1)' }} />
          <p className="relative z-[1] m-0 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[rgba(255,253,250,0.55)]">Admin Panel</p>
          <p className="relative z-[1] mt-10 max-w-[280px] font-sans text-[13px] italic leading-[1.7] text-[rgba(255,253,250,0.45)]">"Let's get you a fresh link."</p>
          <div className="absolute bottom-10 z-[1] flex gap-2">
            <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
            <span className="h-[6px] w-[6px] rounded-full bg-[rgba(255,253,250,0.4)]" />
            <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
          </div>
        </aside>
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 md:p-[40px_3vw]">
          <div className="w-full max-w-[400px] animate-auth-fade-up">
            <p className="m-0 mb-2.5 text-[9px] font-bold uppercase tracking-[0.22em] text-terra">Error</p>
            <h1 className="m-0 mb-1.5 font-playfair text-[clamp(26px,7vw,36px)] font-medium leading-[1.1] tracking-[-0.04em] text-ink">Invalid <em>link</em></h1>
            <p className="m-0 mb-8 text-[13px] leading-[1.5] text-muted">This reset link is invalid or expired.</p>
            <Link to="/admin" className="text-[11px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">Back to login</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper md:flex-row">
      {/* Mobile brand header (below md) */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-wine to-ink px-5 py-5 md:hidden">
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[140px]" style={{ filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Left brand panel (md and up) */}
      <aside className="relative hidden w-[50%] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-wine to-ink p-[40px_20px] text-center md:flex">
        <div className="pointer-events-none absolute inset-0" style={{ background: RADIAL_PATTERN }} aria-hidden="true" />
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="relative z-[1] mb-4 h-auto w-[300px]" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="relative z-[1] m-0 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[rgba(255,253,250,0.55)]">Admin Panel</p>
        <p className="relative z-[1] mt-10 max-w-[280px] font-sans text-[13px] italic leading-[1.7] text-[rgba(255,253,250,0.45)]">"Choose a strong password to secure your account."</p>
        <div className="absolute bottom-10 z-[1] flex gap-2">
          <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
          <span className="h-[6px] w-[6px] rounded-full bg-[rgba(255,253,250,0.4)]" />
          <span className="h-[5px] w-[5px] rounded-full bg-[rgba(255,253,250,0.2)]" />
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10 md:p-[40px_3vw]">
        <div className="w-full max-w-[400px] animate-auth-fade-up">
          <p className="m-0 mb-2.5 text-[9px] font-bold uppercase tracking-[0.22em] text-terra">New Password</p>
          <h1 className="m-0 mb-1.5 font-playfair text-[clamp(26px,7vw,36px)] font-medium leading-[1.1] tracking-[-0.04em] text-ink">Reset <em>password</em></h1>
          <p className="m-0 mb-8 text-[13px] leading-[1.5] text-muted">Enter your new password below.</p>

          {success ? (
            <div className="flex flex-col gap-5">
              <p className="m-0 border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-[11px_14px] text-[12px] leading-[1.4] text-[#2a7a3b]">{success}</p>
              <Link to="/admin" className="text-center text-[12px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
              <label className="m-0 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">New password</span>
                <div className="relative flex items-center">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
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

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="-mt-3 flex gap-1">
                  <div className={`h-[3px] flex-1 transition-colors duration-300 ${strength.bars >= 1 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
                  <div className={`h-[3px] flex-1 transition-colors duration-300 ${strength.bars >= 2 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
                  <div className={`h-[3px] flex-1 transition-colors duration-300 ${strength.bars >= 3 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
                </div>
              )}

              <label className="m-0 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Confirm new password</span>
                <div className="relative flex items-center">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    className="h-[46px] w-full border border-line bg-paper px-3.5 pr-10 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-terra focus:shadow-[0_0_0_3px_rgba(167,78,62,0.08)]"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-[46px] w-10 items-center justify-center border-none bg-transparent p-0 text-muted transition-colors duration-200 hover:text-terra"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? (
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

              <button
                className="inline-flex h-12 w-full items-center justify-center border-none bg-terra text-[11px] font-bold uppercase tracking-[0.14em] text-[#fffaf5] transition-all duration-200 hover:bg-wine active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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
      </main>
    </div>
  );
}
