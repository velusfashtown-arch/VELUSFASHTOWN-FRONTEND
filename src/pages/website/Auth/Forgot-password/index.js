import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Login/index.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setSent(true);
      // Navigate to OTP page after brief delay
      setTimeout(() => navigate('/verify-otp', { state: { email } }), 1200);
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
            <p className="eyebrow">RESET PASSWORD</p>
            <h1>Forgot <em>password?</em></h1>
          </div>
          {sent ? (
            <div className="auth-form">
              <p className="auth-success">✓ OTP sent! Redirecting to verification...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Enter your email address and we'll send you a one-time password (OTP) to reset your password.
              </p>
              <label className="auth-field">
                <span>Email</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button className="store-primary-button full" type="submit" disabled={loading}>
                {loading ? 'SENDING...' : 'SEND OTP'}
              </button>
              <p className="auth-switch">
                Remember your password? <Link to="/login">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

