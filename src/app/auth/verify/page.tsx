'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const devOtp = searchParams.get('devOtp') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the complete 6-digit code'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setSuccess('Email verified successfully!');
      setTimeout(() => router.push('/account'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend');
      setCountdown(30);
      setSuccess('New code sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-100">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="heading-md text-neutral-800 mb-2">Missing Email</h1>
            <p className="text-body text-neutral-500 mb-6">No email address provided. Please register first.</p>
            <Link href="/auth/register" className="btn-primary inline-flex items-center gap-2">
              Register <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-sm bg-gold-600 flex items-center justify-center">
              <span className="text-white font-display text-xl font-bold">O</span>
            </div>
            <span className="text-2xl font-display font-bold text-neutral-800">ORPIND</span>
          </Link>
          <h1 className="heading-md text-neutral-800 mb-2">Verify Your Email</h1>
          <p className="text-body text-neutral-500">Enter the 6-digit code sent to</p>
          <p className="text-sm font-medium text-neutral-700 mt-1">{email}</p>
          {devOtp && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-sm text-sm">
              <p className="text-amber-800 font-semibold">⚠️ Dev Mode — OTP: <span className="text-lg tracking-widest">{devOtp}</span></p>
              <p className="text-amber-600 text-xs mt-1">No email service configured. Use this code to verify.</p>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-100">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold border border-neutral-300 rounded-sm focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                  autoFocus={i === 0}
                  disabled={isLoading || !!success}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!success}
              className="btn-primary w-full group disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={countdown > 0 || isResending || !!success}
              className="text-sm text-gold-600 hover:text-gold-700 disabled:text-neutral-400 disabled:cursor-not-allowed inline-flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : isResending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
