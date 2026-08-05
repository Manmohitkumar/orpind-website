import auditRepository from '../repositories/audit.repository.js';

class AuditService {
  async log({ userId, action, entity, entityId, changes, ipAddress, userAgent, requestId, metadata }) {
    return auditRepository.model.create({ userId, action, entity, entityId, changes, ipAddress, userAgent, requestId, metadata });
  }

  async findByEntity(entity, entityId) { return auditRepository.model.find({ entity, entityId }).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }); }

  async findByUser(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      auditRepository.model.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      auditRepository.model.countDocuments({ userId }),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getEntityAuditTrail({ entity, entityId }) {
    return this.findByEntity(entity, entityId);
  }

  async getUserAuditTrail({ userId, page = 1, limit = 20 }) {
    return this.findByUser(userId, { page, limit });
  }

  async getAuditLogs({ page = 1, limit = 20, entity, action, startDate, endDate } = {}) {
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
      auditRepository.model.find(filter).populate('userId', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      auditRepository.model.countDocuments(filter),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new AuditService();
