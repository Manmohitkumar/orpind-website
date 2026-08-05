import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia',
});

export async function createStripePaymentIntent(data: {
  amount: number;
  currency?: string;
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
}) {
  return stripe.paymentIntents.create({
    amount: data.amount,
    currency: data.currency || 'inr',
    metadata: {
      orderId: data.orderId,
      orderNumber: data.orderNumber,
    },
    receipt_email: data.customerEmail,
    description: `Order ${data.orderNumber} - Orpind`,
  });
}

export async function retrieveStripePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function createStripeRefund(paymentIntentId: string, amount?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount,
  });
}

export function verifyStripeWebhook(body: string, signature: string): Stripe.Event {
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
}

export async function getStripePaymentMethods(customerId: string) {
  return stripe.paymentMethods.list({ customer: customerId });
}

export default stripe;
