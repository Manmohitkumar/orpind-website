'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ShopError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('Shop error:', error); }, [error]);
  return (
    <section className="section-padding pt-32 text-center">
      <div className="container-custom mx-auto">
        <h2 className="heading-sm text-neutral-800 mb-4">Failed to load products</h2>
        <p className="text-neutral-500 mb-6">Something went wrong. Please try again.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <Link href="/" className="btn-secondary">Go Home</Link>
        </div>
      </div>
    </section>
  );
}
