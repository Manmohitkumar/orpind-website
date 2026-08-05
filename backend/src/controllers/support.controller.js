import supportService from '../services/support.service.js';

class SupportController {
  async createTicket(req, res, next) {
    try {
      const { subject, message, category, orderId, priority } = req.body;
      const data = await supportService.createTicket(req.user, { subject, message, category, orderId, priority });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getTickets(req, res, next) {
    try {
      const { status, page, limit } = req.query;
      const data = await supportService.getTickets(req.user, { status, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getTicketById(req, res, next) {
    try {
      const data = await supportService.getTicketById(req.user, req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async addMessage(req, res, next) {
    try {
      const { message } = req.body;
      const data = await supportService.addMessage(req.user, req.params.id, { message });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateTicketStatus(req, res, next) {
    try {
      const { status } = req.body;
      const data = await supportService.updateTicketStatus(req.params.id, { status });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async assignTicket(req, res, next) {
    try {
      const { assignedTo } = req.body;
      const data = await supportService.assignTicket(req.params.id, { assignedTo });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getTicketStats(req, res, next) {
    try {
      const data = await supportService.getTicketStats();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const supportController = new SupportController();

export const {
  createTicket,
  getTickets,
  getTicketById,
  addMessage,
  updateTicketStatus,
  assignTicket,
  getTicketStats,
} = supportController;

export default supportController;