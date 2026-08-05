import BaseRepository from './base.repository.js';
import SupportTicket from '../models/supportTicket.model.js';

class SupportRepository extends BaseRepository {
  constructor() {
    super(SupportTicket);
  }

  async findById(id) {
    return this.model.findById(id).populate('userId', 'firstName lastName email').populate('orderId orderNumber').populate('assignedTo', 'firstName lastName');
  }

  async findByUser(userId, { page = 1, limit = 10, status } = {}) {
    const filter = { userId, isDeleted: { $ne: true } };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async addMessage(id, messageData) {
    return this.model.findByIdAndUpdate(id, { $push: { messages: messageData } }, { new: true });
  }

  async updateStatus(id, status) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }

  async assign(id, assignedTo) {
    return this.model.findByIdAndUpdate(id, { assignedTo, status: 'in_progress' }, { new: true });
  }

  async getStats() {
    const [open, inProgress, resolved, closed] = await Promise.all([
      this.model.countDocuments({ status: 'open', isDeleted: { $ne: true } }),
      this.model.countDocuments({ status: 'in_progress', isDeleted: { $ne: true } }),
      this.model.countDocuments({ status: 'resolved', isDeleted: { $ne: true } }),
      this.model.countDocuments({ status: 'closed', isDeleted: { $ne: true } }),
    ]);
    return { open, inProgress, resolved, closed, total: open + inProgress + resolved + closed };
  }

  async findAll({ page = 1, limit = 20, status, priority, assignedTo } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName email').populate('assignedTo', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new SupportRepository();
