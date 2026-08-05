'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service'); return; }
    try {
      const payload: { firstName: string; lastName: string; email: string; password: string; phone?: string } = { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password };
      if (form.phone) payload.phone = form.phone;
      const result = await register(payload);
      if (result.requiresVerification) {
        const params = new URLSearchParams({ email: form.email });
        if (result.devOtp) params.set('devOtp', result.devOtp);
        router.push(`/auth/verify?${params.toString()}`);
      } else {
        router.push('/account');
      }
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Registration failed. Please try again.'); }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

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
          <h1 className="heading-md text-neutral-800 mb-2">Create Account</h1>
          <p className="text-body text-neutral-500">Join the Orpind family for authentic organic spices</p>
        </div>

        <div className="bg-white p-8 rounded-sm shadow-sm border border-neutral-100">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">First Name *</label>
                <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="text" required value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-field pl-10" placeholder="First name" /></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Last Name *</label>
                <input type="text" required value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-field" placeholder="Last name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address *</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className="input-field pl-10" placeholder="your@email.com" /></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number</label>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field pl-10" placeholder="+91 62833 48561" /></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password *</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => update('password', e.target.value)} className="input-field pl-10 pr-10" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password *</label>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="password" required value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="input-field pl-10" placeholder="Repeat password" /></div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 accent-gold-500" />
              <span className="text-xs text-neutral-500">I agree to the <Link href="/terms" className="text-gold-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</Link></span>
            </label>

            <button type="submit" disabled={isLoading} className="btn-primary w-full group disabled:opacity-50">
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold-600 hover:text-gold-700 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
