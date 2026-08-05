import { Resend } from 'resend';

const FROM_EMAIL = process.env.SMTP_FROM || 'Orpind <delivered@resend.dev>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://orpind.com';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

// ─── Email Templates ─────────────────────────────────
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;margin:0;padding:0;background:#FAF7F2;color:#4A3A2A}
  .container{max-width:600px;margin:0 auto;background:#fff}
  .header{background:#2A1F17;padding:24px;text-align:center}
  .header h1{color:#E8A838;margin:0;font-size:24px;letter-spacing:3px}
  .content{padding:32px 24px}
  .btn{display:inline-block;padding:12px 32px;background:#C85215;color:#fff;text-decoration:none;border-radius:2px;font-weight:600}
  .footer{padding:24px;text-align:center;border-top:1px solid #E0D5C1;font-size:12px;color:#8B6D45}
  .divider{width:50px;height:2px;background:#C85215;margin:16px 0}
</style></head><body>
<div class="container">
  <div class="header"><h1>ORPIND</h1><p style="color:#CCBB9C;font-size:12px;margin:4px 0 0">Premium Organic Spices</p></div>
  <div class="content">${content}</div>
  <div class="footer">
    <p>Orpind Foods Pvt. Ltd. · GT Road, Phagwara, Punjab - 144401</p>
    <p>📞 +91 62833 48561 · ✉ mohitchetiwal291@gmail.com</p>
    <p style="margin-top:12px"><a href="${SITE_URL}/unsubscribe" style="color:#8B6D45">Unsubscribe</a></p>
  </div>
</div></body></html>`;

// ─── Order Confirmation ──────────────────────────────
export async function sendOrderConfirmation(to: string, data: {
  orderNumber: string;
  items: Array<{ name: string; weight: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
}) {
  const itemsHtml = data.items.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #E0D5C1">${i.name} (${i.weight})</td><td style="padding:8px 0;border-bottom:1px solid #E0D5C1;text-align:center">${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #E0D5C1;text-align:right">₹${i.price}</td></tr>`
  ).join('');

  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Order Confirmed! 🎉</h2>
    <div class="divider"></div>
    <p>Thank you for your order. We're preparing it with love.</p>
    <table style="width:100%;margin:16px 0;font-size:14px">
      <tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #2A1F17">Item</th><th style="text-align:center;padding:8px 0;border-bottom:2px solid #2A1F17">Qty</th><th style="text-align:right;padding:8px 0;border-bottom:2px solid #2A1F17">Price</th></tr>
      ${itemsHtml}
      <tr><td colspan="2" style="padding:12px 0 0;font-weight:bold">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:bold;font-size:16px">₹${data.total}</td></tr>
    </table>
    <p><strong>Order #:</strong> ${data.orderNumber}</p>
    <p><strong>Shipping to:</strong> ${data.shippingAddress}</p>
    <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE_URL}/account/orders" class="btn">Track Your Order</a>
    </div>
  `);

  return sendEmail({ to, subject: `Order Confirmed #${data.orderNumber} - Orpind`, html });
}

// ─── Order Shipped ───────────────────────────────────
export async function sendOrderShipped(to: string, data: {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
}) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Your Order is On Its Way! 🚚</h2>
    <div class="divider"></div>
    <p>Great news! Your order <strong>#${data.orderNumber}</strong> has been shipped.</p>
    <p><strong>Carrier:</strong> ${data.carrier}</p>
    <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
    <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE_URL}/account/orders/${data.orderNumber}" class="btn">Track Order</a>
    </div>
  `);

  return sendEmail({ to, subject: `Order #${data.orderNumber} Shipped - Orpind`, html });
}

// ─── Order Delivered ─────────────────────────────────
export async function sendOrderDelivered(to: string, data: {
  orderNumber: string;
  name: string;
}) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Delivered! Enjoy Your Spices 🌿</h2>
    <div class="divider"></div>
    <p>Hi ${data.name},</p>
    <p>Your order <strong>#${data.orderNumber}</strong> has been delivered successfully.</p>
    <p>We hope you love the authentic flavors of Punjab! If you have a moment, we'd appreciate your review.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE_URL}/account/orders/${data.orderNumber}" class="btn">Write a Review</a>
    </div>
  `);

  return sendEmail({ to, subject: `Order #${data.orderNumber} Delivered - Orpind`, html });
}

// ─── Welcome Email ───────────────────────────────────
export async function sendWelcomeEmail(to: string, data: { firstName: string }) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Welcome to the Orpind Family! 🌶️</h2>
    <div class="divider"></div>
    <p>Hi ${data.firstName},</p>
    <p>Welcome to Orpind! You're now part of a community that values authentic, organic Punjabi spices.</p>
    <p>As a welcome gift, use code <strong style="color:#C85215">WELCOME10</strong> for 10% off your first order.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE_URL}/shop" class="btn">Start Shopping</a>
    </div>
    <p style="font-size:14px;color:#8B6D45">💡 Tip: Check out our <a href="${SITE_URL}/blog" style="color:#C85215">blog</a> for recipes and spice guides!</p>
  `);

  return sendEmail({ to, subject: 'Welcome to Orpind! 🌶️', html });
}

// ─── Password Reset ──────────────────────────────────
export async function sendPasswordReset(to: string, data: { resetLink: string; firstName: string }) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Reset Your Password</h2>
    <div class="divider"></div>
    <p>Hi ${data.firstName},</p>
    <p>We received a request to reset your password. Click the button below to create a new one.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${data.resetLink}" class="btn">Reset Password</a>
    </div>
    <p style="font-size:13px;color:#8B6D45">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
  `);

  return sendEmail({ to, subject: 'Reset Your Password - Orpind', html });
}

// ─── Refund Processed ────────────────────────────────
export async function sendRefundConfirmation(to: string, data: {
  orderNumber: string;
  refundAmount: number;
}) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Refund Processed ✅</h2>
    <div class="divider"></div>
    <p>Your refund of <strong>₹${data.refundAmount}</strong> for order <strong>#${data.orderNumber}</strong> has been processed.</p>
    <p>The amount will be credited to your original payment method within 5-7 business days.</p>
  `);

  return sendEmail({ to, subject: `Refund Processed - Order #${data.orderNumber} - Orpind`, html });
}

// ─── OTP Verification ────────────────────────────────
export async function sendOtpEmail(to: string, data: { firstName: string; otp: string }) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">Verify Your Email</h2>
    <div class="divider"></div>
    <p>Hi ${data.firstName},</p>
    <p>Your verification code is:</p>
    <div style="text-align:center;margin:24px 0;padding:16px;background:#FAF7F2;border-radius:4px">
      <span style="font-size:36px;letter-spacing:8px;font-weight:bold;color:#2A1F17">${data.otp}</span>
    </div>
    <p>This code expires in 10 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `);

  return sendEmail({ to, subject: 'Verify Your Email - Orpind', html });
}

// ─── Newsletter Welcome ──────────────────────────────
export async function sendNewsletterWelcome(to: string) {
  const html = baseTemplate(`
    <h2 style="color:#2A1F17">You're Subscribed! 📬</h2>
    <div class="divider"></div>
    <p>Thank you for subscribing to the Orpind newsletter!</p>
    <p>You'll receive exclusive offers, recipes, and updates about our organic spice collections.</p>
    <div style="text-align:center;margin:24px 0">
      <a href="${SITE_URL}/shop" class="btn">Explore Products</a>
    </div>
  `);

  return sendEmail({ to, subject: 'Welcome to Orpind Newsletter! 📬', html });
}
