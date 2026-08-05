import BaseRepository from './base.repository.js';
import Shipment from '../models/shipment.model.js';

class ShipmentRepository extends BaseRepository {
  constructor() {
    super(Shipment);
  }

  async findByOrder(orderId) {
    return this.model.findOne({ orderId });
  }

  async findByTrackingNumber(trackingNumber) {
    return this.model.findOne({ trackingNumber });
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }

  async addEvent(id, event) {
    return this.model.findByIdAndUpdate(id, { $push: { events: event } }, { new: true });
  }

  async getTrackingInfo(orderId) {
    return this.model.findOne({ orderId }).populate('originWarehouse', 'name address');
  }

  async findAll({ page = 1, limit = 20, status, carrier } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (carrier) filter.carrier = carrier;
    const skip = (page - 1) * limit;
    const [shipments, total] = await Promise.all([
      this.model.find(filter).populate({ path: 'orderId', select: 'orderNumber userId' }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { shipments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new ShipmentRepository();
