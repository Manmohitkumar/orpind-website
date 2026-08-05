import cartRepository from '../repositories/cart.repository.js';
import productRepository from '../repositories/product.repository.js';
import couponRepository from '../repositories/coupon.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class CartService {
  async getCart(userId) {
    const items = await cartRepository.model.find({ userId })
      .populate({
        path: 'productId',
        select: 'name slug price comparePrice images status sku minOrderQuantity maxOrderQuantity',
        match: { isDeleted: false },
      })
      .sort({ addedAt: -1 });

    const validItems = items.filter((item) => item.productId);

    const cartData = validItems.map((item) => ({
      _id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      slug: item.productId.slug,
      price: item.productId.price,
      comparePrice: item.productId.comparePrice,
      image: item.productId.images && item.productId.images.length > 0
        ? item.productId.images.find((img) => img.isPrimary) || item.productId.images[0]
        : null,
      sku: item.productId.sku,
      quantity: item.quantity,
      itemTotal: item.productId.price * item.quantity,
      minOrderQuantity: item.productId.minOrderQuantity || 1,
      maxOrderQuantity: item.productId.maxOrderQuantity,
      inStock: item.productId.status === 'active',
    }));

    const totals = this.calculateTotals(cartData);

    return { items: cartData, ...totals };
  }

  async addToCart(userId, productId, quantity = 1) {
    const product = await productRepository.findOne({ _id: productId });
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    if (product.status !== 'active') {
      throw new AppError(MESSAGES.CART.PRODUCT_UNAVAILABLE, 400);
    }

    const existingItem = await cartRepository.findOne({ userId, productId });

    const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    if (product.maxOrderQuantity && newQuantity > product.maxOrderQuantity) {
      throw new AppError(MESSAGES.CART.MAX_QUANTITY, 400);
    }

    if (existingItem) {
      existingItem.quantity = newQuantity;
      await existingItem.save();
      logger.info('Cart item quantity updated', { userId, productId, quantity: newQuantity });
      return existingItem;
    }

    const cartItem = await cartRepository.create({ userId, productId, quantity });
    logger.info('Item added to cart', { userId, productId, quantity });
    return cartItem;
  }

  async updateCartItem(userId, productId, quantity) {
    if (quantity < 1) {
      return this.removeFromCart(userId, productId);
    }

    const product = await productRepository.findOne({ _id: productId });
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    if (product.maxOrderQuantity && quantity > product.maxOrderQuantity) {
      throw new AppError(MESSAGES.CART.MAX_QUANTITY, 400);
    }

    const item = await cartRepository.updateItemQuantity(userId, productId, quantity);
    if (!item) {
      throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);
    }

    logger.info('Cart item updated', { userId, productId, quantity });
    return item;
  }

  async removeFromCart(userId, productId) {
    const item = await cartRepository.removeItem(userId, productId);
    if (!item) {
      throw new AppError(MESSAGES.CART.ITEM_NOT_FOUND, 404);
    }

    logger.info('Item removed from cart', { userId, productId });
    return true;
  }

  async clearCart(userId) {
    await cartRepository.clearCart(userId);
    logger.info('Cart cleared', { userId });
    return true;
  }

  async applyCoupon(userId, couponCode) {
    const coupon = await couponRepository.findByCode(couponCode);
    if (!coupon) {
      throw new AppError(MESSAGES.COUPON.INVALID, 404);
    }

    if (!coupon.isActive) {
      throw new AppError(MESSAGES.COUPON.NOT_ACTIVE, 400);
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new AppError(MESSAGES.COUPON.EXPIRED, 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(MESSAGES.COUPON.USAGE_EXCEEDED, 400);
    }

    const cart = await this.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new AppError(MESSAGES.CART.CART_EMPTY, 400);
    }

    const subtotal = cart.subtotal;
    if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
      throw new AppError(`${MESSAGES.COUPON.MINIMUM_NOT_MET}. Minimum: ₹${coupon.minimumOrder}`, 400);
    }

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const hasApplicable = cart.items.some((item) =>
        coupon.applicableProducts.some((pId) => pId.toString() === item.productId.toString())
      );
      if (!hasApplicable) {
        throw new AppError(MESSAGES.COUPON.PRODUCT_RESTRICTED, 400);
      }
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const productIds = cart.items.map((item) => item.productId);
      const products = await productRepository.find({ _id: { $in: productIds } });
      const hasApplicable = products.some((p) =>
        coupon.applicableCategories.some((cId) => cId.toString() === p.categoryId?.toString())
      );
      if (!hasApplicable) {
        throw new AppError(MESSAGES.COUPON.CATEGORY_RESTRICTED, 400);
      }
    }

    const discount = coupon.calculateDiscount(subtotal);

    logger.info('Coupon applied', { userId, couponCode, discount });
    return {
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      maximumDiscount: coupon.maximumDiscount,
    };
  }

  async removeCoupon(_userId, _couponCode) {
    logger.info('Coupon removed');
    return true;
  }

  async getCartTotals(userId) {
    const cart = await this.getCart(userId);
    return {
      subtotal: cart.subtotal,
      discount: cart.discount || 0,
      tax: cart.tax || 0,
      shipping: cart.shipping || 0,
      total: cart.total || 0,
    };
  }

  calculateTotals(items) {
    let subtotal = 0;
    let totalTax = 0;

    for (const item of items) {
      subtotal += item.itemTotal;
    }

    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal - (0) + shipping + totalTax;

    return {
      subtotal,
      discount: 0,
      tax: totalTax,
      shipping,
      total: Math.round(total * 100) / 100,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }
}

export default CartService;
