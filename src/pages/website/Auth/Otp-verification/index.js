import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Login/index.css';

export default function OtpVerificationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) {
      setError('No email found. Please start again.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.verifyOtp({ email, otp });
      setMessage('OTP verified! Redirecting...');
      setTimeout(() => navigate('/reset-password', { state: { resetToken: res.data.resetToken } }), 1000);
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
            <p className="eyebrow">VERIFY OTP</p>
            <h1>Enter <em>OTP</em></h1>
          </div>
          {message ? (
            <div className="auth-form">
              <p className="auth-success">✓ {message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Enter the 6-digit OTP sent to {email ? <strong>{email}</strong> : 'your email'}.
              </p>
              {!email ? (
                <p className="auth-error">No email found. Please <Link to="/forgot-password" style={{ color: 'var(--terra)' }}>start again</Link>.</p>
              ) : null}
              <label className="auth-field">
                <span>OTP Code</span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button className="store-primary-button full" type="submit" disabled={loading || !email}>
                {loading ? 'VERIFYING...' : 'VERIFY OTP'}
              </button>
              <p className="auth-switch">
                Didn't receive it? <Link to="/forgot-password">Resend OTP</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

