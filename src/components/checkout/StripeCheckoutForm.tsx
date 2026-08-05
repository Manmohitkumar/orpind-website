'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function StripeForm({ orderId, total, onSuccess, onError }: { orderId: string; total: number; onSuccess: () => void; onError: (msg: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders` },
      redirect: 'if_required',
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe || processing} className="btn-primary mt-6">
        {processing ? 'Processing...' : `Pay ${formatPrice(total)}`}
      </button>
    </form>
  );
}

export default function StripeCheckoutForm({ total, orderId, onSuccess, onError }: { total: number; orderId: string; onSuccess: () => void; onError: (msg: string) => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initializePayment = async () => {
    setLoading(true);
    try {
      const res = await api.post<{ clientSecret: string }>('/api/payments/stripe', { orderId });
      setClientSecret(res.clientSecret);
    } catch (err: any) {
      onError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret) {
    return (
      <button onClick={initializePayment} disabled={loading} className="btn-primary">
        {loading ? 'Initializing...' : `Pay with Card - ${formatPrice(total)}`}
      </button>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <StripeForm orderId={orderId} total={total} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
