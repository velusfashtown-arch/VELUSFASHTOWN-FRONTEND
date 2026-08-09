import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

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
<div className="overflow-hidden bg-paper">
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-cream p-[60px_20px_80px]">
        <div className="w-full max-w-[420px] border border-line bg-paper p-[45px_35px_40px] max-[620px]:p-[35px_22px_30px]">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">NEW PASSWORD</p>
            <h1 className="m-0 font-playfair text-[clamp(32px,5vw,42px)] font-medium leading-none tracking-[-0.05em] text-ink">Reset <em>password</em></h1>
          </div>
          {done ? (
            <div className="flex flex-col gap-4">
              <p className="m-0 border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-2.5 text-center text-[12px] text-[#2a7a3b]">✓ Password reset successful! Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="m-0 text-[13px] leading-[1.6] text-muted">
                Choose a new password for your account.
              </p>
              <label className="m-0 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.12em] text-muted">New password</span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
              </label>
              <label className="m-0 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.12em] text-muted">Confirm new password</span>
                <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra" />
              </label>
              {error ? <p className="m-0 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-2.5 text-center text-[12px] text-[#a53232]">{error}</p> : null}
              <button className="inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted" type="submit" disabled={loading || !resetToken}>
                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
              <p className="m-0 mt-1 text-center text-[12px] text-muted">
                <Link to="/login" className="font-bold text-terra no-underline hover:underline">Back to sign in</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

