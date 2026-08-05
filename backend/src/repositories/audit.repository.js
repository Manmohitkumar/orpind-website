import BaseRepository from './base.repository.js';
import AuditLog from '../models/auditLog.model.js';

class AuditRepository extends BaseRepository {
  constructor() {
    super(AuditLog);
  }

  async findByEntity(entity, entityId) {
    return this.model.find({ entity, entityId }).populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
  }

  async findByUser(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.model.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments({ userId }),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll({ page = 1, limit = 20, entity, action, startDate, endDate } = {}) {
    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new AuditRepository();
