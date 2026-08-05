export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id) {
    throw new Error('Not implemented');
  }

  async findOne(filter) {
    throw new Error('Not implemented');
  }

  async find(filter, options) {
    throw new Error('Not implemented');
  }

  async create(data) {
    throw new Error('Not implemented');
  }

  async update(id, data) {
    throw new Error('Not implemented');
  }

  async delete(id) {
    throw new Error('Not implemented');
  }

  async count(filter) {
    throw new Error('Not implemented');
  }

  async paginate(filter, options) {
    throw new Error('Not implemented');
  }
}

export class ProductRepository extends BaseRepository {
  async findBySlug(slug) {
    throw new Error('Not implemented');
  }

  async findBySku(sku) {
    throw new Error('Not implemented');
  }

  async search(query, options) {
    throw new Error('Not implemented');
  }

  async getFeatured(limit) {
    throw new Error('Not implemented');
  }

  async getRelated(productId, limit) {
    throw new Error('Not implemented');
  }

  async updateStock(productId, quantity) {
    throw new Error('Not implemented');
  }
}

export class UserRepository extends BaseRepository {
  async findByEmail(email) {
    throw new Error('Not implemented');
  }

  async findByPhone(phone) {
    throw new Error('Not implemented');
  }

  async findByRefreshToken(token) {
    throw new Error('Not implemented');
  }

  async addRefreshToken(userId, token) {
    throw new Error('Not implemented');
  }

  async removeRefreshToken(userId, token) {
    throw new Error('Not implemented');
  }
}

export class OrderRepository extends BaseRepository {
  async findByOrderNumber(orderNumber) {
    throw new Error('Not implemented');
  }

  async findByUser(userId, options) {
    throw new Error('Not implemented');
  }

  async updateStatus(orderId, status) {
    throw new Error('Not implemented');
  }

  async getNextOrderNumber() {
    throw new Error('Not implemented');
  }
}

export class CartRepository {
  constructor(model) {
    this.model = model;
  }

  async getCart(userId) {
    throw new Error('Not implemented');
  }

  async addItem(userId, item) {
    throw new Error('Not implemented');
  }

  async updateItem(userId, itemId, data) {
    throw new Error('Not implemented');
  }

  async removeItem(userId, itemId) {
    throw new Error('Not implemented');
  }

  async clearCart(userId) {
    throw new Error('Not implemented');
  }
}

export class CouponRepository extends BaseRepository {
  async findByCode(code) {
    throw new Error('Not implemented');
  }

  async incrementUsage(couponId) {
    throw new Error('Not implemented');
  }

  async decrementUsage(couponId) {
    throw new Error('Not implemented');
  }
}

export class ReviewRepository extends BaseRepository {
  async findByProduct(productId, options) {
    throw new Error('Not implemented');
  }

  async findByUser(userId) {
    throw new Error('Not implemented');
  }

  async approve(reviewId) {
    throw new Error('Not implemented');
  }

  async reject(reviewId) {
    throw new Error('Not implemented');
  }

  async updateStats(productId) {
    throw new Error('Not implemented');
  }
}

export class InventoryRepository extends BaseRepository {
  async findByProduct(productId) {
    throw new Error('Not implemented');
  }

  async findByWarehouse(warehouseId) {
    throw new Error('Not implemented');
  }

  async reserveStock(productId, warehouseId, quantity) {
    throw new Error('Not implemented');
  }

  async releaseStock(productId, warehouseId, quantity) {
    throw new Error('Not implemented');
  }

  async adjustStock(productId, warehouseId, quantity, reason) {
    throw new Error('Not implemented');
  }
}

export class PaymentRepository extends BaseRepository {
  async findByOrder(orderId) {
    throw new Error('Not implemented');
  }

  async findByProviderPaymentId(providerPaymentId) {
    throw new Error('Not implemented');
  }

  async findByIdempotencyKey(key) {
    throw new Error('Not implemented');
  }
}

export class NotificationRepository extends BaseRepository {
  async findByUser(userId, options) {
    throw new Error('Not implemented');
  }

  async markAsRead(notificationId) {
    throw new Error('Not implemented');
  }

  async markAllAsRead(userId) {
    throw new Error('Not implemented');
  }

  async getUnreadCount(userId) {
    throw new Error('Not implemented');
  }
}
