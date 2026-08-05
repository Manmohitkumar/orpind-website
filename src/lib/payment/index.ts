import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ─── Create Order ────────────────────────────────────
export async function createRazorpayOrder(data: {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  return razorpay.orders.create({
    amount: data.amount,
    currency: data.currency || 'INR',
    receipt: data.receipt,
    notes: data.notes || {},
  });
}

// ─── Verify Payment ──────────────────────────────────
export function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
    .digest('hex');
  return expectedSignature === data.razorpay_signature;
}

// ─── Fetch Payment ───────────────────────────────────
export async function fetchRazorpayPayment(paymentId: string) {
  return razorpay.payments.fetch(paymentId);
}

// ─── Create Refund ───────────────────────────────────
export async function createRazorpayRefund(data: {
  paymentId: string;
  amount?: number; // partial refund in paise, undefined for full refund
  notes?: Record<string, string>;
}) {
  return razorpay.payments.refund(data.paymentId, {
    amount: data.amount,
    notes: data.notes || {},
  });
}

// ─── Webhook Verification ────────────────────────────
export function verifyRazorpayWebhook(body: string, signature: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

// ─── Razorpay Order Status ──────────────────────────
export async function getOrderPayments(orderId: string) {
  return razorpay.orders.fetchPayments(orderId);
}

// ─── Create Subscription (for recurring orders) ──────
export async function createRazorpaySubscription(data: {
  planId: string;
  customerId: string;
  totalCount: number;
  notes?: Record<string, string>;
}) {
  return razorpay.subscriptions.create({
    plan_id: data.planId,
    customer_id: data.customerId,
    total_count: data.totalCount,
    notes: data.notes || {},
  } as any);
}

// ─── Razorpay Customer ──────────────────────────────
export async function createRazorpayCustomer(data: {
  name: string;
  email: string;
  phone?: string;
  gstin?: string;
}) {
  return razorpay.customers.create(data);
}

export default razorpay;
