import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import './index.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      login(res.data.token, res.data.customer);
      navigate(location.state?.from || '/');
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
            <p className="eyebrow">WELCOME BACK</p>
            <h1>Sign <em>in</em></h1>
          </div>
          <form onSubmit={handleSubmit} className="auth-form">
            <label className="auth-field">
              <span>Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </label>
            <label className="auth-field">
              <span>Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            </label>
            {error ? <p className="auth-error">{error}</p> : null}
            <button className="store-primary-button full" type="submit" disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
            <div className="auth-links">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

