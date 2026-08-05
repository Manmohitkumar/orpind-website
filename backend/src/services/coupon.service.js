import couponRepository from '../repositories/coupon.repository.js';
import productRepository from '../repositories/product.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class CouponService {
  async validateCoupon(code, orderTotal, userId, cartItems = []) {
    const coupon = await couponRepository.model.findOne({ code: code.toUpperCase(), isDeleted: false });
    if (!coupon) {
      throw new AppError(MESSAGES.COUPON.INVALID, 404);
    }

    if (!coupon.isActive) {
      throw new AppError(MESSAGES.COUPON.NOT_ACTIVE, 400);
    }

    if (coupon.startDate && new Date() < coupon.startDate) {
      throw new AppError(MESSAGES.COUPON.NOT_ACTIVE, 400);
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new AppError(MESSAGES.COUPON.EXPIRED, 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(MESSAGES.COUPON.USAGE_EXCEEDED, 400);
    }

    if (coupon.minimumOrder && orderTotal < coupon.minimumOrder) {
      throw new AppError(`${MESSAGES.COUPON.MINIMUM_NOT_MET}. Minimum order: ₹${coupon.minimumOrder}`, 400);
    }

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const applicableProductIds = coupon.applicableProducts.map((p) => p.toString());
      const hasApplicable = cartItems.some((item) =>
        applicableProductIds.includes(item.productId.toString())
      );
      if (!hasApplicable) {
        throw new AppError(MESSAGES.COUPON.PRODUCT_RESTRICTED, 400);
      }
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const productIds = cartItems.map((item) => item.productId);
      const products = await productRepository.model.find({ _id: { $in: productIds } }).select('categoryId');
      const hasApplicable = products.some((p) =>
        coupon.applicableCategories.some((cId) => cId.toString() === p.categoryId?.toString())
      );
      if (!hasApplicable) {
        throw new AppError(MESSAGES.COUPON.CATEGORY_RESTRICTED, 400);
      }
    }

    return coupon;
  }

  async applyCoupon(code, orderTotal, userId, cartItems = []) {
    const coupon = await this.validateCoupon(code, orderTotal, userId, cartItems);
    const discount = coupon.calculateDiscount(orderTotal);

    return {
      couponId: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      maximumDiscount: coupon.maximumDiscount,
      freeShipping: coupon.discountType === 'free_shipping',
    };
  }

  async createCoupon(data, createdBy) {
    if (data.code) {
      const existing = await couponRepository.model.findOne({ code: data.code.toUpperCase(), isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.COUPON.ALREADY_EXISTS, 409);
      }
    }

    const coupon = await couponRepository.model.create({ ...data, createdBy });
    logger.info('Coupon created', { couponId: coupon._id, code: coupon.code });
    return coupon;
  }

  async updateCoupon(couponId, data) {
    if (data.code) {
      const existing = await couponRepository.model.findOne({ code: data.code.toUpperCase(), _id: { $ne: couponId }, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.COUPON.ALREADY_EXISTS, 409);
      }
    }

    const coupon = await couponRepository.model.findOneAndUpdate(
      { _id: couponId, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      throw new AppError(MESSAGES.COUPON.NOT_FOUND, 404);
    }

    logger.info('Coupon updated', { couponId });
    return coupon;
  }

  async deleteCoupon(couponId) {
    const coupon = await couponRepository.model.findById(couponId);
    if (!coupon) {
      throw new AppError(MESSAGES.COUPON.NOT_FOUND, 404);
    }

    coupon.isDeleted = true;
    coupon.isActive = false;
    await coupon.save();

    logger.info('Coupon deleted', { couponId });
    return true;
  }

  async getCouponById(couponId) {
    const coupon = await couponRepository.model.findOne({ _id: couponId, isDeleted: false });
    if (!coupon) {
      throw new AppError(MESSAGES.COUPON.NOT_FOUND, 404);
    }
    return coupon;
  }

  async getAllCoupons(query) {
    return this.getCoupons(query);
  }

  async getCoupons({ page = 1, limit = 20, search, isActive, discountType } = {}) {
    const filter = { isDeleted: false };
    if (isActive !== undefined) filter.isActive = isActive;
    if (discountType) filter.discountType = discountType;
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      couponRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      couponRepository.model.countDocuments(filter),
    ]);

    return {
      coupons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new CouponService();
