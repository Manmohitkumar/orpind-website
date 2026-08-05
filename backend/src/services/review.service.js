import reviewRepository from '../repositories/review.repository.js';
import productRepository from '../repositories/product.repository.js';
import orderRepository from '../repositories/order.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class ReviewService {
  async getReviewsByProduct(productId, { page = 1, limit = 10, sort = '-createdAt' } = {}) {
    const skip = (page - 1) * limit;
    const filter = { productId, isDeleted: false, isApproved: true };

    const [reviews, total] = await Promise.all([
      reviewRepository.model.find(filter).populate('userId', 'firstName lastName').sort(sort).skip(skip).limit(limit),
      reviewRepository.model.countDocuments(filter),
    ]);

    const stats = await this.getReviewStats(productId);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats,
    };
  }

  async createReview(userId, productId, { rating, title, comment, images, orderId }) {
    const existingReview = await reviewRepository.findOne({ userId, productId });
    if (existingReview) {
      throw new AppError(MESSAGES.REVIEW.ALREADY_REVIEWED, 409);
    }

    if (orderId) {
      const order = await orderRepository.findOne({ _id: orderId, user: userId, status: 'delivered' });
      if (!order) {
        throw new AppError(MESSAGES.REVIEW.VERIFIED_PURCHASE_ONLY, 400);
      }
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError(MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const review = await reviewRepository.create({
      userId,
      productId,
      orderId,
      rating,
      title,
      comment,
      images: images || [],
      isVerified: !!orderId,
      isApproved: false,
    });

    await reviewRepository.model.calculateAverageRating(productId);

    logger.info('Review created', { reviewId: review._id, userId, productId });
    return review;
  }

  async updateReview(reviewId, userId, data) {
    const review = await reviewRepository.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    const allowedFields = ['rating', 'title', 'comment', 'images'];
    const updates = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    }

    Object.assign(review, updates);
    await review.save();
    await reviewRepository.model.calculateAverageRating(review.productId);

    logger.info('Review updated', { reviewId, userId });
    return review;
  }

  async deleteReview(reviewId, userId) {
    const review = await reviewRepository.findOne({ _id: reviewId, userId });
    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    review.isDeleted = true;
    await review.save();
    await reviewRepository.model.calculateAverageRating(review.productId);

    logger.info('Review deleted', { reviewId, userId });
    return true;
  }

  async voteHelpful(reviewId, isHelpful) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    if (isHelpful) {
      review.helpfulCount = (review.helpfulCount || 0) + 1;
    } else {
      review.notHelpfulCount = (review.notHelpfulCount || 0) + 1;
    }

    await review.save({ validateBeforeSave: false });
    return review;
  }

  async respondToReview(reviewId, adminResponse, respondedBy) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    review.adminResponse = adminResponse;
    review.respondedAt = new Date();
    review.respondedBy = respondedBy;
    await review.save({ validateBeforeSave: false });

    logger.info('Admin responded to review', { reviewId, respondedBy });
    return review;
  }

  async approveReview(reviewId) {
    const review = await reviewRepository.model.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      { $set: { isApproved: true, isRejected: false } },
      { new: true }
    );

    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    await reviewRepository.model.calculateAverageRating(review.productId);

    logger.info('Review approved', { reviewId });
    return review;
  }

  async rejectReview(reviewId) {
    const review = await reviewRepository.model.findOneAndUpdate(
      { _id: reviewId, isDeleted: false },
      { $set: { isApproved: false, isRejected: true } },
      { new: true }
    );

    if (!review) {
      throw new AppError(MESSAGES.REVIEW.NOT_FOUND, 404);
    }

    await reviewRepository.model.calculateAverageRating(review.productId);

    logger.info('Review rejected', { reviewId });
    return review;
  }

  async getReviews(productId, opts) {
    return this.getReviewsByProduct(productId, opts);
  }

  async getAllReviews({ page = 1, limit = 20, rating, isApproved } = {}) {
    const filter = { isDeleted: false };
    if (rating) filter.rating = Number(rating);
    if (isApproved !== undefined) filter.isApproved = isApproved;
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      reviewRepository.model.find(filter).populate('userId', 'firstName lastName').populate('productId', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
      reviewRepository.model.countDocuments(filter),
    ]);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getReviewStats(productId) {
    const result = await reviewRepository.model.aggregate([
      { $match: { productId, isApproved: true, isDeleted: { $ne: true } } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const total = result.reduce((sum, r) => sum + r.count, 0);
    const average = total > 0
      ? result.reduce((sum, r) => sum + r._id * r.count, 0) / total
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of result) {
      distribution[r._id] = r.count;
    }

    return {
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    };
  }
}

export default new ReviewService();
