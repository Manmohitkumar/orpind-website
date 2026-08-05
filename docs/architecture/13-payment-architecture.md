## 13. Payment Architecture

### Payment Abstraction Layer

```
┌────────────────────────────────────────────────────────┐
│                PAYMENT ABSTRACTION                      │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │           PaymentService (interface)          │      │
│  │                                               │      │
│  │  createOrder(order) → PaymentOrder            │      │
│  │  verifyPayment(data) → VerificationResult     │      │
│  │  refund(paymentId, amount) → RefundResult     │      │
│  │  getStatus(paymentId) → PaymentStatus         │      │
│  └──────────────────────────────────────────────┘      │
│           │              │              │               │
│           ▼              ▼              ▼               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │   Razorpay   │ │    Stripe    │ │     COD      │   │
│  │   Provider   │ │   Provider   │ │   Provider   │   │
│  │  (primary)   │ │  (future)    │ │  (fallback)  │   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Razorpay Integration Flow

```
1. Order Placement
   Client → POST /api/v1/orders → OrderService.createOrder()
     → Create order in DB (status: PENDING, paymentStatus: PENDING)
     → Return order to client

2. Payment Initiation
   Client → POST /api/v1/payments/create-order
     → PaymentService.createRazorpayOrder()
     → Return razorpayOrderId, amount, key to client

3. Client-Side Razorpay Checkout
   Client loads Razorpay.js → Opens checkout modal
   User completes payment → Razorpay returns signature

4. Payment Verification
   Client → POST /api/v1/payments/verify
     → Verify HMAC signature
     → Update payment status: CAPTURED
     → Update order status: CONFIRMED, paymentStatus: PAID
     → Trigger order confirmation email
     → Emit "payment.success" event

5. Webhook (backup verification)
   Razorpay → POST /api/v1/payments/webhook/razorpay
     → Verify webhook signature
     → Idempotency check
     → Process event (payment.captured, payment.failed, refund.created)
     → Return 200 OK
```

### COD Flow

```
1. User selects "Cash on Delivery"
2. Order created with paymentMethod: "cod"
3. Order status: CONFIRMED (payment pending)
4. On delivery: delivery agent collects payment
5. Warehouse marks "payment_collected" → webhook
6. Order updated: paymentStatus: PAID
```

### Refund Flow

```
1. Admin initiates refund (full or partial)
2. PaymentService.createRefund(paymentId, amount)
3. Razorpay processes refund (T+5-7 business days)
4. Webhook received: refund.created → refund.processed
5. Order updated: paymentStatus: REFUNDED
6. Refund confirmation email sent
7. Inventory restored (if full refund + undelivered)
```

### Invoice Generation

```
GST-Compliant Invoice:
  - Company: Orpind Foods Pvt. Ltd.
  - GSTIN: Registered
  - HSN codes per product category
  - CGST + SGST (intra-state) or IGST (inter-state)
  - Invoice number: INV-YYMM-XXXXXX
  - Generated as PDF (PDFKit or Puppeteer)
  - Stored in Cloudinary/invoices/
  - Attached to order confirmation email
```

### Payment Audit Trail

```
Every payment event logged:
  - orderId, paymentId, action, amount
  - provider response, webhook payload
  - idempotency key
  - timestamp, ip, user-agent
  - Stored in payments collection + audit_logs
```
