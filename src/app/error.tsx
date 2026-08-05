'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <section className="section-padding pt-32 min-h-screen flex items-center justify-center">
      <div className="container-custom mx-auto text-center max-w-lg">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
          <span className="text-4xl">!</span>
        </div>
        <h1 className="heading-sm text-neutral-800 mb-4">Something went wrong</h1>
        <p className="text-body text-neutral-500 mb-8">We encountered an unexpected error. Please try again.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <Link href="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    </section>
  );
}
