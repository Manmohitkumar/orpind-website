'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error('Checkout error:', error); }, [error]);
  return (
    <section className="section-padding pt-32 text-center">
      <div className="container-custom mx-auto">
        <h2 className="heading-sm text-neutral-800 mb-4">Checkout unavailable</h2>
        <p className="text-neutral-500 mb-6">Something went wrong during checkout. Please try again.</p>
        <div className="flex items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary">Try Again</button>
          <Link href="/cart" className="btn-secondary">Back to Cart</Link>
        </div>
      </div>
    </section>
  );
}
