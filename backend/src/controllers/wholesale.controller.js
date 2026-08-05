import wholesaleService from '../services/wholesale.service.js';

class WholesaleController {
  async getWholesaleProducts(req, res, next) {
    try {
      const { page, limit } = req.query;
      const data = await wholesaleService.getWholesaleProducts({ page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async placeWholesaleOrder(req, res, next) {
    try {
      const { items, addressId, notes } = req.body;
      const data = await wholesaleService.placeWholesaleOrder(req.user, { items, addressId, notes });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async registerWholesaleBuyer(req, res, next) {
    try {
      const data = await wholesaleService.registerWholesaleBuyer(req.user, req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const wholesaleController = new WholesaleController();

export const {
  getWholesaleProducts,
  placeWholesaleOrder,
  registerWholesaleBuyer,
} = wholesaleController;

export default wholesaleController;