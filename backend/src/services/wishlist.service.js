import wishlistRepository from '../repositories/wishlist.repository.js';
import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class WishlistService {
  async getWishlist(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      wishlistRepository.model.find({ userId })
        .populate({
          path: 'productId',
          select: 'name slug price comparePrice images status averageRating',
          match: { isDeleted: false },
        })
        .sort({ addedAt: -1 })
        .skip(skip)
        .limit(limit),
      wishlistRepository.model.countDocuments({ userId }),
    ]);

    const validItems = items.filter((item) => item.productId);

    return {
      items: validItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async addToWishlist(userId, productId) {
    const product = await productRepository.findOne({ _id: productId });
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const existing = await wishlistRepository.findOne({ userId, productId });
    if (existing) {
      return existing;
    }

    const item = await wishlistRepository.create({ userId, productId });
    logger.info('Item added to wishlist', { userId, productId });
    return item;
  }

  async removeFromWishlist(userId, productId) {
    const item = await wishlistRepository.removeItem(userId, productId);
    if (!item) {
      throw new AppError(MESSAGES.USER.WISHLIST_ITEM_REMOVED, 404);
    }
    logger.info('Item removed from wishlist', { userId, productId });
    return true;
  }

  async moveToCart(userId, productId) {
    const product = await productRepository.findOne({ _id: productId });
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const item = await wishlistRepository.removeItem(userId, productId);
    if (!item) {
      throw new AppError('Item not found in wishlist', 404);
    }

    const existingCartItem = await cartRepository.findOne({ userId, productId });
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      await cartRepository.create({ userId, productId, quantity: 1 });
    }

    logger.info('Item moved from wishlist to cart', { userId, productId });
    return true;
  }

  async isInWishlist(userId, productId) {
    const item = await wishlistRepository.findOne({ userId, productId });
    return !!item;
  }
}

export default WishlistService;
