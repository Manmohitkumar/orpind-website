import reviewService from '../services/review.service.js';

class ReviewController {
  async getReviews(req, res, next) {
    try {
      const { page, limit, sort, rating } = req.query;
      const data = await reviewService.getReviewsByProduct(req.params.productId, { page, limit, sort, rating });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req, res, next) {
    try {
      const { rating, title, comment } = req.body;
      const data = await reviewService.createReview(req.user._id, req.params.productId, { rating, title, comment });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
      const data = await reviewService.updateReview(req.params.id, req.user._id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const data = await reviewService.deleteReview(req.params.id, req.user._id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async voteHelpful(req, res, next) {
    try {
      const { helpful } = req.body;
      const data = await reviewService.voteHelpful(req.params.id, helpful);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async respondToReview(req, res, next) {
    try {
      const { text } = req.body;
      const data = await reviewService.respondToReview(req.params.id, text, req.user._id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async approveReview(req, res, next) {
    try {
      const data = await reviewService.approveReview(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async rejectReview(req, res, next) {
    try {
      const data = await reviewService.rejectReview(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const reviewController = new ReviewController();

export const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  respondToReview,
  approveReview,
  rejectReview,
} = reviewController;

export default reviewController;