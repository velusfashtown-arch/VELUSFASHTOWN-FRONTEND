import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authApi } from '../auth.api';
import { adminBtnPrimary } from '../../Common/buttonClasses';

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

function AuthShell({ eyebrow, title, subtitle, children }) {
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
        <div className="mb-7 flex flex-col items-center text-center">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[150px]" />
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-muted">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-[rgba(47,31,25,0.08)] bg-paper p-7 shadow-[0_20px_50px_rgba(47,31,25,0.10)] sm:p-9">
          <div className="mb-7 text-center">
            <p className="m-0 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-terra">{eyebrow}</p>
            <h1 className="m-0 font-playfair text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-[32px]">{title}</h1>
            <p className="m-0 mt-2 text-[13px] leading-relaxed text-muted">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="mt-7 text-center text-[11px] leading-relaxed text-muted">
          &copy; {new Date().getFullYear()} Velu&apos;s Fashtown &mdash; Curating timeless fashion.
        </p>
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, show, onToggle, required, minLength }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">{label}</span>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="w-full rounded-md border border-line bg-paper py-2.5 pl-3 pr-10 font-sans text-[13px] text-ink outline-none transition-colors focus:border-terra"
        />
        <button
          type="button"
          className="absolute right-0 top-0 flex h-full w-10 items-center justify-center border-none bg-transparent p-0 text-muted transition-colors duration-200 hover:text-terra"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
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
  );
}

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
      <AuthShell eyebrow="Error" title={<>Invalid <em>link</em></>} subtitle="This reset link is invalid or expired.">
        <div className="flex flex-col items-center gap-5">
          <Link to="/admin" className="text-[12px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow="New Password" title={<>Reset <em>password</em></>} subtitle="Enter your new password below.">
      {success ? (
        <div className="flex flex-col gap-5">
          <p className="m-0 rounded-md border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-[11px_14px] text-[12px] leading-[1.4] text-[#2a7a3b]">{success}</p>
          <Link to="/admin" className="text-center text-[12px] font-semibold text-terra no-underline transition-colors duration-200 hover:text-wine hover:underline">
            Return to sign in
          </Link>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <PasswordField
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            show={showPw}
            onToggle={() => setShowPw((p) => !p)}
            required
            minLength={6}
          />

          {password.length > 0 && (
            <div className="-mt-3 flex gap-1">
              <div className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${strength.bars >= 1 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
              <div className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${strength.bars >= 2 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
              <div className={`h-[3px] flex-1 rounded-full transition-colors duration-300 ${strength.bars >= 3 ? strengthColor : 'bg-[rgba(47,31,25,0.1)]'}`} />
            </div>
          )}

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            show={showConfirm}
            onToggle={() => setShowConfirm((p) => !p)}
            required
          />

          {error && (
            <p className="m-0 rounded-md border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-[11px_14px] text-[12px] leading-[1.4] text-[#a53232]">{error}</p>
          )}

          <button className={`${adminBtnPrimary} w-full`} type="submit" disabled={loading}>
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
    </AuthShell>
  );
}
