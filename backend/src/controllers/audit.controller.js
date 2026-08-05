import auditService from '../services/audit.service.js';

class AuditController {
  async getAuditLogs(req, res, next) {
    try {
      const { entity, action, startDate, endDate, page, limit } = req.query;
      const data = await auditService.getAuditLogs({ entity, action, startDate, endDate, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getEntityAuditTrail(req, res, next) {
    try {
      const { entity, entityId } = req.query;
      const data = await auditService.getEntityAuditTrail({ entity, entityId });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getUserAuditTrail(req, res, next) {
    try {
      const { userId, page, limit } = req.query;
      const data = await auditService.getUserAuditTrail({ userId, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const auditController = new AuditController();

export const {
  getAuditLogs,
  getEntityAuditTrail,
  getUserAuditTrail,
} = auditController;

export default auditController;