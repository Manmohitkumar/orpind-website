import inventoryRepository from '../repositories/inventory.repository.js';
import auditRepository from '../repositories/audit.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class InventoryService {
  async getInventoryByProduct(productId) {
    const inventory = await inventoryRepository.findByProduct(productId);
    return inventory;
  }

  async getInventoryByWarehouse(warehouseId, { page = 1, limit = 50 } = {}) {
    const filter = { warehouseId };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      inventoryRepository.model.find(filter)
        .populate('productId', 'name sku images price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      inventoryRepository.model.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adjustStock(productId, warehouseId, newQuantity, reason, userId, ip) {
    const inventory = await inventoryRepository.findOne({ productId, warehouseId });
    if (!inventory) {
      throw new AppError(MESSAGES.INVENTORY.NOT_FOUND, 404);
    }

    const previousQuantity = inventory.quantity;
    inventory.quantity = newQuantity;
    await inventory.save();

    await auditRepository.create({
      userId,
      action: 'stock_adjustment',
      entity: 'Inventory',
      entityId: inventory._id,
      changes: {
        before: { quantity: previousQuantity },
        after: { quantity: newQuantity },
      },
      ipAddress: ip,
      metadata: { reason, productId, warehouseId },
    });

    logger.info('Stock adjusted', { productId, warehouseId, previousQuantity, newQuantity, reason });
    return inventory;
  }

  async reserveStock(productId, warehouseId, quantity) {
    const inventory = await inventoryRepository.findOne({ productId, warehouseId });
    if (!inventory) {
      throw new AppError(MESSAGES.INVENTORY.NOT_FOUND, 404);
    }

    const available = inventory.quantity - (inventory.reservedQuantity || 0);
    if (available < quantity) {
      throw new AppError(MESSAGES.INVENTORY.INSUFFICIENT_STOCK, 400);
    }

    inventory.reservedQuantity = (inventory.reservedQuantity || 0) + quantity;
    await inventory.save();

    logger.info('Stock reserved', { productId, warehouseId, quantity });
    return inventory;
  }

  async releaseStock(productId, warehouseId, quantity) {
    const inventory = await inventoryRepository.findOne({ productId, warehouseId });
    if (!inventory) {
      throw new AppError(MESSAGES.INVENTORY.NOT_FOUND, 404);
    }

    if ((inventory.reservedQuantity || 0) < quantity) {
      throw new AppError('Cannot release more than reserved', 400);
    }

    inventory.reservedQuantity = (inventory.reservedQuantity || 0) - quantity;
    await inventory.save();

    logger.info('Stock released', { productId, warehouseId, quantity });
    return inventory;
  }

  async getLowStockItems(threshold = 10) {
    const items = await inventoryRepository.model.find({
      $expr: { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', threshold] }] },
    })
      .populate('productId', 'name sku images')
      .populate('warehouseId', 'name');
    return items;
  }

  async getOutOfStockItems({ page = 1, limit = 50 } = {}) {
    const filter = { quantity: 0 };
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      inventoryRepository.model.find(filter)
        .populate('productId', 'name sku images')
        .populate('warehouseId', 'name')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      inventoryRepository.model.countDocuments(filter),
    ]);

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAll({ warehouseId, status, page = 1, limit = 50 } = {}) {
    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      inventoryRepository.model.find(filter).populate('productId', 'name sku images price').populate('warehouseId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      inventoryRepository.model.countDocuments(filter),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getLowStock() {
    return this.getLowStockItems();
  }

  async getOutOfStock() {
    return this.getOutOfStockItems();
  }

  async getExpiringSoon(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const items = await inventoryRepository.model.find({
      expiryDate: { $lte: futureDate, $gte: new Date() },
    })
      .populate('productId', 'name sku')
      .populate('warehouseId', 'name')
      .sort({ expiryDate: 1 });

    return items;
  }

  async bulkUpdate(updates) {
    const operations = updates.map(({ id, data }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: data },
      },
    }));

    const result = await inventoryRepository.bulkWrite(operations);
    logger.info('Bulk inventory update', { modified: result.modifiedCount });
    return result;
  }
}

export default new InventoryService();
