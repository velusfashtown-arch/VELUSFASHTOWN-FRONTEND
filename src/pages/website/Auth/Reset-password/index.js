import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import '../Login/index.css';

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const resetToken = state?.resetToken || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!resetToken) {
      setError('Invalid reset session. Please start again.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ resetToken, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
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
            <p className="eyebrow">NEW PASSWORD</p>
            <h1>Reset <em>password</em></h1>
          </div>
          {done ? (
            <div className="auth-form">
              <p className="auth-success">✓ Password reset successful! Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Choose a new password for your account.
              </p>
              <label className="auth-field">
                <span>New password</span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </label>
              <label className="auth-field">
                <span>Confirm new password</span>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" />
              </label>
              {error ? <p className="auth-error">{error}</p> : null}
              <button className="store-primary-button full" type="submit" disabled={loading || !resetToken}>
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
              <p className="auth-switch">
                <Link to="/login">Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

