import BaseRepository from './base.repository.js';
import CartItem from '../models/cartItem.model.js';

class CartRepository extends BaseRepository {
  constructor() {
    super(CartItem);
  }

  async getCart(userId) {
    return this.model.find({ userId }).populate('productId', 'name slug price comparePrice images weight stockQuantity isActive').sort({ addedAt: -1 });
  }

  async addItem(userId, productId, quantity) {
    return this.model.findOneAndUpdate(
      { userId, productId },
      { $set: { quantity, addedAt: new Date() } },
      { new: true, upsert: true }
    );
  }

  async updateItemQuantity(userId, productId, quantity) {
    return this.model.findOneAndUpdate({ userId, productId }, { $set: { quantity } }, { new: true });
  }

  async removeItem(userId, productId) {
    return this.model.findOneAndDelete({ userId, productId });
  }

  async clearCart(userId) {
    return this.model.deleteMany({ userId });
  }

  async getItemCount(userId) {
    const result = await this.model.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalItems: { $sum: '$quantity' } } },
    ]);
    return result[0]?.totalItems || 0;
  }
}

export default new CartRepository();
