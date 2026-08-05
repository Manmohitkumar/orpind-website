import supportRepository from '../repositories/support.repository.js';
import { logger } from '../config/logger.js';

class SupportService {
  async createTicket(userId, { subject, message, category, orderId, priority }) {
    const count = await supportRepository.model.countDocuments();
    const ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
    return supportRepository.model.create({ ticketNumber, userId, orderId, subject, description: message, category, priority: priority || 'medium', messages: [{ senderId: userId, senderType: 'customer', message }] });
  }

  async getTicketsByUser(userId, { page = 1, limit = 10, status } = {}) {
    const filter = { userId, isDeleted: { $ne: true } };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      supportRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      supportRepository.model.countDocuments(filter),
    ]);
    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getTicketById(id, userId) {
    const ticket = await supportRepository.model.findById(id).populate('userId', 'firstName lastName email').populate('orderId', 'orderNumber').populate('assignedTo', 'firstName lastName');
    if (!ticket) throw Object.assign(new Error('Ticket not found'), { statusCode: 404 });
    return ticket;
  }

  async addMessage(ticketId, userId, senderType, message) {
    return supportRepository.model.findByIdAndUpdate(ticketId, { $push: { messages: { senderId: userId, senderType, message, createdAt: new Date() } } }, { new: true });
  }

  async updateTicketStatus(id, status) {
    const update = { status };
    if (status === 'resolved') update.resolvedAt = new Date();
    if (status === 'closed') update.closedAt = new Date();
    return supportRepository.model.findByIdAndUpdate(id, update, { new: true });
  }

  async assignTicket(id, assignedTo) {
    return supportRepository.model.findByIdAndUpdate(id, { assignedTo, status: 'in_progress' }, { new: true });
  }

  async getTicketStats() {
    const [open, inProgress, resolved, closed] = await Promise.all([
      supportRepository.model.countDocuments({ status: 'open', isDeleted: { $ne: true } }),
      supportRepository.model.countDocuments({ status: 'in_progress', isDeleted: { $ne: true } }),
      supportRepository.model.countDocuments({ status: 'resolved', isDeleted: { $ne: true } }),
      supportRepository.model.countDocuments({ status: 'closed', isDeleted: { $ne: true } }),
    ]);
    return { open, inProgress, resolved, closed, total: open + inProgress + resolved + closed };
  }

  async getTickets(user, opts) {
    const userId = user._id || user;
    return this.getTicketsByUser(userId, opts);
  }

  async getAllTickets({ page = 1, limit = 20, status, priority, assignedTo } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    const skip = (page - 1) * limit;
    const [tickets, total] = await Promise.all([
      supportRepository.model.find(filter).populate('userId', 'firstName lastName email').populate('assignedTo', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      supportRepository.model.countDocuments(filter),
    ]);
    return { tickets, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new SupportService();
