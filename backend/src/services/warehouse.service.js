import warehouseRepository from '../repositories/warehouse.repository.js';
import inventoryRepository from '../repositories/inventory.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class WarehouseService {
  async createWarehouse(data) {
    if (data.code) {
      const existing = await warehouseRepository.model.findOne({ code: data.code });
      if (existing) {
        throw new AppError(MESSAGES.WAREHOUSE.ALREADY_EXISTS, 409);
      }
    }
    const warehouse = await warehouseRepository.model.create(data);
    logger.info('Warehouse created', { warehouseId: warehouse._id, name: warehouse.name });
    return warehouse;
  }

  async updateWarehouse(warehouseId, data) {
    if (data.code) {
      const existing = await warehouseRepository.model.findOne({ code: data.code, _id: { $ne: warehouseId } });
      if (existing) {
        throw new AppError(MESSAGES.WAREHOUSE.ALREADY_EXISTS, 409);
      }
    }
    const warehouse = await warehouseRepository.model.findByIdAndUpdate(
      warehouseId,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!warehouse) {
      throw new AppError(MESSAGES.WAREHOUSE.NOT_FOUND, 404);
    }
    logger.info('Warehouse updated', { warehouseId });
    return warehouse;
  }

  async softDelete(warehouseId) {
    const warehouse = await warehouseRepository.model.findById(warehouseId);
    if (!warehouse) {
      throw new AppError(MESSAGES.WAREHOUSE.NOT_FOUND, 404);
    }

    const hasInventory = await inventoryRepository.model.countDocuments({ warehouseId, quantity: { $gt: 0 }, isDeleted: false });
    if (hasInventory > 0) {
      throw new AppError('Cannot delete warehouse with existing inventory', 400);
    }

    warehouse.isActive = false;
    await warehouse.save();
    logger.info('Warehouse deactivated', { warehouseId });
    return true;
  }

  async getAllWarehouses({ page = 1, limit = 50, isActive } = {}) {
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive;
    else filter.isActive = true;

    const skip = (page - 1) * limit;
    const [warehouses, total] = await Promise.all([
      warehouseRepository.model.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      warehouseRepository.model.countDocuments(filter),
    ]);

    return { warehouses, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getWarehouseInventory(warehouseId, { page = 1, limit = 50 } = {}) {
    const warehouse = await warehouseRepository.model.findById(warehouseId);
    if (!warehouse) {
      throw new AppError(MESSAGES.WAREHOUSE.NOT_FOUND, 404);
    }

    const filter = { warehouseId, isDeleted: false };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      inventoryRepository.model.find(filter)
        .populate('productId', 'name sku images price')
        .sort({ quantity: -1 })
        .skip(skip)
        .limit(limit),
      inventoryRepository.model.countDocuments(filter),
    ]);

    return {
      warehouse,
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteWarehouse(warehouseId) {
    return this.softDelete(warehouseId);
  }

  async getWarehouseById(warehouseId) {
    const warehouse = await warehouseRepository.model.findById(warehouseId);
    if (!warehouse) {
      throw new AppError(MESSAGES.WAREHOUSE.NOT_FOUND, 404);
    }
    return warehouse;
  }
}

export default new WarehouseService();
