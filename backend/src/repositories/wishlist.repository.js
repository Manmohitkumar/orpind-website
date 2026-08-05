import BaseRepository from './base.repository.js';
import WishlistItem from '../models/wishlistItem.model.js';

class WishlistRepository extends BaseRepository {
  constructor() {
    super(WishlistItem);
  }

  async getWishlist(userId) {
    return this.model.find({ userId }).populate('productId', 'name slug price comparePrice images weight isActive').sort({ addedAt: -1 });
  }

  async addItem(userId, productId) {
    return this.model.findOneAndUpdate(
      { userId, productId },
      { $setOnInsert: { addedAt: new Date() } },
      { new: true, upsert: true }
    );
  }

  async removeItem(userId, productId) {
    return this.model.findOneAndDelete({ userId, productId });
  }

  async hasItem(userId, productId) {
    return this.model.findOne({ userId, productId });
  }

  async clearWishlist(userId) {
    return this.model.deleteMany({ userId });
  }
}

export default new WishlistRepository();
