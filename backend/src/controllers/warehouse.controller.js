import warehouseService from '../services/warehouse.service.js';

class WarehouseController {
  async createWarehouse(req, res, next) {
    try {
      const data = await warehouseService.createWarehouse(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateWarehouse(req, res, next) {
    try {
      const data = await warehouseService.updateWarehouse(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteWarehouse(req, res, next) {
    try {
      const data = await warehouseService.deleteWarehouse(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAllWarehouses(req, res, next) {
    try {
      const data = await warehouseService.getAllWarehouses();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getWarehouseInventory(req, res, next) {
    try {
      const data = await warehouseService.getWarehouseInventory(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const warehouseController = new WarehouseController();

export const {
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getAllWarehouses,
  getWarehouseInventory,
} = warehouseController;

export default warehouseController;