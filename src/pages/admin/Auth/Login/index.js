 import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../../../../lib/auth';
import { api } from '../../../../lib/api';
import '../admin-auth.css';

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
      const res = await api.adminLogin({ email, password });
      // Response: { success: true, message: "Login successful", data: { accessToken, refreshToken, admin } }
      const token = res?.data?.accessToken || res?.data?.token || res?.token || '';
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
    <div className="admin-auth-wrapper">
      {/* Left brand panel */}
      <aside className="admin-auth-brand">
        <img src="/images/Logo/LOGO.png" alt="Velu's Fashtown" className="h-auto w-[300px] mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="admin-auth-brand-tagline">Admin Panel</p>
        <p className="admin-auth-brand-quote">"Curating timeless fashion for the modern wardrobe."</p>
        <div className="admin-auth-brand-dots">
          <span></span><span></span><span></span>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="admin-auth-form-panel">
        <div className="admin-auth-form-panel-inner">
          <p className="admin-auth-context">Welcome Back</p>
          <h1 className="admin-auth-heading">Sign <em>in</em></h1>
          <p className="admin-auth-sub">Sign in to manage your store</p>

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

            <label className="admin-auth-field">
              <span>Password</span>
              <div className="admin-auth-input-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
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

            {error && (
              <p className="admin-auth-message error">{error}</p>
            )}

            <div className="admin-auth-row">
              <label className="admin-auth-checkbox">
                <input type="checkbox" defaultChecked />
                Remember me
              </label>
              <Link to="/admin/forgot-password" className="admin-auth-link">
                Forgot password?
              </Link>
            </div>

            <button
              className="admin-auth-submit"
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

