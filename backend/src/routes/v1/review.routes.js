import { Router } from "express";
import {
  authenticate,
  validate,
  validateObjectId,
  checkOwnership,
} from "../../middleware/index.js";
import { createReview, updateReview } from "../../validators/review.validator.js";
import * as reviewController from "../../controllers/review.controller.js";
import Review from "../../models/review.model.js";

const router = Router();

router.get("/products/:productId/reviews", reviewController.getReviews);
router.post("/products/:productId/reviews", authenticate, validate(createReview), reviewController.createReview);
router.put("/:id", authenticate, validateObjectId, checkOwnership(Review, "userId"), validate(updateReview), reviewController.updateReview);
router.delete("/:id", authenticate, validateObjectId, checkOwnership(Review, "userId"), reviewController.deleteReview);
router.post("/:id/helpful", authenticate, validateObjectId, reviewController.voteHelpful);

export default router;
