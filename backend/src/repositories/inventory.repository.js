import BaseRepository from './base.repository.js';
import Inventory from '../models/inventory.model.js';

class InventoryRepository extends BaseRepository {
  constructor() {
    super(Inventory);
  }

  async findByProduct(productId) {
    return this.model.find({ productId }).populate('warehouseId', 'name code');
  }

  async findByWarehouse(warehouseId) {
    return this.model.find({ warehouseId }).populate('productId', 'name sku slug images');
  }

  async reserveStock(productId, warehouseId, quantity) {
    return this.model.findOneAndUpdate(
      { productId, warehouseId, $expr: { $gte: [{ $subtract: ['$quantity', '$reservedQuantity'] }, quantity] } },
      { $inc: { reservedQuantity: quantity } },
      { new: true }
    );
  }

  async releaseStock(productId, warehouseId, quantity) {
    return this.model.findOneAndUpdate(
      { productId, warehouseId },
      { $inc: { reservedQuantity: -quantity } },
      { new: true }
    );
  }

  async adjustStock(productId, warehouseId, quantity) {
    return this.model.findOneAndUpdate(
      { productId, warehouseId },
      { $inc: { quantity } },
      { new: true, upsert: true }
    );
  }

  async getLowStock(threshold = 10) {
    return this.model.find({ $expr: { $lte: ['$quantity', '$lowStockThreshold'] }, quantity: { $gt: 0 } }).populate('productId', 'name sku').populate('warehouseId', 'name');
  }

  async getOutOfStock() {
    return this.model.find({ quantity: 0 }).populate('productId', 'name sku').populate('warehouseId', 'name');
  }

  async getExpiringSoon(days = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return this.model.find({ expiryDate: { $lte: futureDate, $gte: new Date() } }).populate('productId', 'name sku');
  }

  async getAll({ page = 1, limit = 20, warehouseId, status } = {}) {
    const filter = {};
    if (warehouseId) filter.warehouseId = warehouseId;
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.model.find(filter).populate('productId', 'name sku').populate('warehouseId', 'name code').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new InventoryRepository();
