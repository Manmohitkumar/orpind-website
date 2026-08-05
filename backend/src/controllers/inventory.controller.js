import inventoryService from '../services/inventory.service.js';

class InventoryController {
  async getInventory(req, res, next) {
    try {
      const { warehouseId, status, page, limit } = req.query;
      const data = await inventoryService.getInventory({ warehouseId, status, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req, res, next) {
    try {
      const { productId, warehouseId, quantity, reason } = req.body;
      const data = await inventoryService.adjustStock(productId, warehouseId, quantity, reason, req.user._id, req.ip);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getLowStock(req, res, next) {
    try {
      const data = await inventoryService.getLowStock();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getOutOfStock(req, res, next) {
    try {
      const data = await inventoryService.getOutOfStock();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdate(req, res, next) {
    try {
      const { items } = req.body;
      const data = await inventoryService.bulkUpdate({ items });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const inventoryController = new InventoryController();

export const {
  getInventory,
  adjustStock,
  getLowStock,
  getOutOfStock,
  bulkUpdate,
} = inventoryController;

export default inventoryController;