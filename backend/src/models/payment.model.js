import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    provider: {
      type: String,
      enum: ['razorpay', 'stripe', 'cod', 'wallet'],
      required: [true, 'Payment provider is required'],
    },
    providerPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    providerOrderId: {
      type: String,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
      default: 'created',
    },
    method: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'wallet'],
    },
    cardLast4: {
      type: String,
      match: [/^\d{4}$/, 'Card last 4 must be exactly 4 digits'],
    },
    upiId: {
      type: String,
      trim: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
    },
    refundId: {
      type: String,
    },
    refundReason: {
      type: String,
      trim: true,
    },
    refundedAt: {
      type: Date,
    },
    webhookReceivedAt: {
      type: Date,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
