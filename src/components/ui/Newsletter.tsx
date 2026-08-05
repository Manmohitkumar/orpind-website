'use client';

import { useState, type FormEvent } from 'react';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface NewsletterProps {
  variant?: 'inline' | 'section';
  className?: string;
  onSubscribe?: (email: string) => Promise<void>;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Newsletter({ variant = 'section', className = '', onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setStatus('loading');
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-green-50 rounded-md border border-green-200 ${className}`}>
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-green-800 text-sm">You're subscribed!</p>
          <p className="text-xs text-green-600">Thank you for joining the Orpind family.</p>
        </div>
      </div>
    );
  }

  const sectionLayout = variant === 'section' ? 'text-center max-w-lg mx-auto' : '';

  return (
    <div className={`${sectionLayout} ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
            placeholder="Enter your email"
            className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-md text-sm text-neutral-900 placeholder:text-neutral-400 placeholder:italic focus:outline-none focus:border-gold-500 focus:ring-[3px] focus:ring-gold-500/15 transition-all duration-200 ${status === 'error' ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error/15' : 'border-neutral-200'}`}
            aria-label="Email address"
            aria-invalid={status === 'error'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white text-sm font-semibold tracking-wide rounded-md hover:bg-gold-600 hover:-translate-y-0.5 hover:shadow-warm-md active:bg-gold-700 active:translate-y-0 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex-shrink-0"
        >
          {status === 'loading' ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
      {status === 'error' && (
        <p className="flex items-center gap-1.5 text-xs text-semantic-error mt-2" role="alert">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </p>
      )}
    </div>
  );
}
