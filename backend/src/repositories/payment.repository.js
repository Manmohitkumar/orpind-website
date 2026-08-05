import BaseRepository from './base.repository.js';
import Payment from '../models/payment.model.js';

class PaymentRepository extends BaseRepository {
  constructor() {
    super(Payment);
  }

  async findByOrder(orderId) {
    return this.model.find({ orderId }).sort({ createdAt: -1 });
  }

  async findByProviderPaymentId(providerPaymentId) {
    return this.model.findOne({ providerPaymentId });
  }

  async findByIdempotencyKey(idempotencyKey) {
    return this.model.findOne({ idempotencyKey });
  }

  async updateStatus(id, status, data = {}) {
    return this.model.findByIdAndUpdate(id, { $set: { status, ...data } }, { new: true });
  }

  async findAll({ page = 1, limit = 20, status, provider, orderId } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (provider) filter.provider = provider;
    if (orderId) filter.orderId = orderId;
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this.model.find(filter).populate('orderId orderNumber').populate('userId firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { payments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new PaymentRepository();
