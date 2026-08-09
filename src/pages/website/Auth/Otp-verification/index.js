import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../../lib/api';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';

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
<div className="overflow-hidden bg-paper">
      <Header />
      <main className="flex min-h-[70vh] items-center justify-center bg-cream p-[60px_20px_80px]">
        <div className="w-full max-w-[420px] border border-line bg-paper p-[45px_35px_40px] max-[620px]:p-[35px_22px_30px]">
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] font-bold tracking-[0.19em] text-terra">VERIFY OTP</p>
            <h1 className="m-0 font-playfair text-[clamp(32px,5vw,42px)] font-medium leading-none tracking-[-0.05em] text-ink">Enter <em>OTP</em></h1>
          </div>
          {message ? (
            <div className="flex flex-col gap-4">
              <p className="m-0 border border-[rgba(42,122,59,0.25)] bg-[#e6f0df] p-2.5 text-center text-[12px] text-[#2a7a3b]">✓ {message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="m-0 text-[13px] leading-[1.6] text-muted">
                Enter the 6-digit OTP sent to {email ? <strong>{email}</strong> : 'your email'}.
              </p>
              {!email ? (
                <p className="m-0 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-2.5 text-center text-[12px] text-[#a53232]">No email found. Please <Link to="/forgot-password" className="text-terra">start again</Link>.</p>
              ) : null}
              <label className="m-0 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.12em] text-muted">OTP Code</span>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-terra"
                />
              </label>
              {error ? <p className="m-0 border border-[rgba(155,53,49,0.25)] bg-[#fcf1ef] p-2.5 text-center text-[12px] text-[#a53232]">{error}</p> : null}
              <button className="inline-flex min-h-[46px] w-full items-center justify-center border border-terra bg-terra px-5 py-3 text-[10px] font-bold tracking-[0.14em] text-[#fffaf5] no-underline transition hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted" type="submit" disabled={loading || !email}>
                {loading ? 'VERIFYING...' : 'VERIFY OTP'}
              </button>
              <p className="m-0 mt-1 text-center text-[12px] text-muted">
                Didn't receive it? <Link to="/forgot-password" className="font-bold text-terra no-underline hover:underline">Resend OTP</Link>
              </p>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

