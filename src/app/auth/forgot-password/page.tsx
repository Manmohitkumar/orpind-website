'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
          <h1 className="heading-md text-neutral-800 mb-2">Reset Password</h1>
          <p className="text-body text-neutral-500">Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-100">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Check your email</h3>
              <p className="text-sm text-neutral-500 mb-6">We&apos;ve sent a password reset link to {email}</p>
              <Link href="/auth/login" className="btn-primary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="your@email.com" />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full group">Send Reset Link <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></button>
              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-gold-600 hover:text-gold-700">Back to Login</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
