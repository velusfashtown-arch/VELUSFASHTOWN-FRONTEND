import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../../lib/api';
import '../admin-auth.css';

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
      const data = await api.adminForgotPassword({ email });
      setSuccess(data.message || 'If this email is registered, a reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-auth-wrapper">
      {/* Left brand panel */}
      <aside className="admin-auth-brand">
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[300px] mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="admin-auth-brand-tagline">Admin Panel</p>
        <p className="admin-auth-brand-quote">"We'll help you get back into your account."</p>
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

          <p className="admin-auth-context">Reset Password</p>
          <h1 className="admin-auth-heading">Forgot <em>password?</em></h1>
          <p className="admin-auth-sub">Enter your email and we'll send you a reset link.</p>

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
                <span>Email</span>
                <div className="admin-auth-input-wrap">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@velusfashtown.com"
                    required
                  />
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

