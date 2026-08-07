import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import '../admin-auth.css';

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
      const data = await api.adminResetPassword({ resetToken: token || '', password });
      setSuccess(data.message || 'Password has been reset successfully.');
      setTimeout(() => nav('/admin'), 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="admin-auth-wrapper">
        <aside className="admin-auth-brand">
          <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[300px] mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
          <p className="admin-auth-brand-tagline">Admin Panel</p>
          <div className="admin-auth-brand-dots">
            <span></span><span></span><span></span>
          </div>
        </aside>
        <main className="admin-auth-form-panel">
          <div className="admin-auth-form-panel-inner">
            <p className="admin-auth-context">Error</p>
            <h1 className="admin-auth-heading">Invalid <em>link</em></h1>
            <p className="admin-auth-sub">This reset link is invalid or expired.</p>
            <Link to="/admin" className="admin-auth-link">Back to login</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-auth-wrapper">
      {/* Left brand panel */}
      <aside className="admin-auth-brand">
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[120px] mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="admin-auth-brand-tagline">Admin Panel</p>
        <p className="admin-auth-brand-quote">"Choose a strong password to secure your account."</p>
        <div className="admin-auth-brand-dots">
          <span></span><span></span><span></span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="admin-auth-form-panel">
        <div className="admin-auth-form-panel-inner">
          <Link to="/admin" className="admin-auth-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to login
          </Link>

          <p className="admin-auth-context">New Password</p>
          <h1 className="admin-auth-heading">Reset <em>password</em></h1>
          <p className="admin-auth-sub">Enter your new password below.</p>

          {success ? (
            <div className="admin-auth-form">
              <p className="admin-auth-message success">{success}</p>
              <Link to="/admin" className="admin-auth-link" style={{ textAlign: 'center', fontSize: 12 }}>
                Return to sign in
              </Link>
            </div>
          ) : (
            <form className="admin-auth-form" onSubmit={onSubmit}>
              <label className="admin-auth-field">
                <span>New password</span>
                <div className="admin-auth-input-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="admin-auth-pw-toggle"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="admin-auth-strength">
                  <div className={`admin-auth-strength-bar active ${strength.className}`} />
                  <div className={`admin-auth-strength-bar ${strength.bars >= 2 ? 'active ' + strength.className : ''}`} />
                  <div className={`admin-auth-strength-bar ${strength.bars >= 3 ? 'active ' + strength.className : ''}`} />
                </div>
              )}

              <label className="admin-auth-field">
                <span>Confirm new password</span>
                <div className="admin-auth-input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-auth-pw-toggle"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>

              {error && (
                <p className="admin-auth-message error">{error}</p>
              )}

              <button
                className="admin-auth-submit"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

