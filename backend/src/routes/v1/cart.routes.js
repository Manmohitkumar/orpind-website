import { Router } from "express";
import {
  authenticate,
  validate,
  validateObjectId,
} from "../../middleware/index.js";
import { addToCart, updateCart, applyCoupon } from "../../validators/cart.validator.js";
import * as cartController from "../../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticate, cartController.getCart);
router.post("/", authenticate, validate(addToCart), cartController.addToCart);
router.put("/", authenticate, validate(updateCart, "body"), cartController.updateCartItem);
router.delete("/", authenticate, cartController.clearCart);
router.post("/coupon", authenticate, validate(applyCoupon), cartController.applyCoupon);
router.delete("/coupon", authenticate, cartController.removeCoupon);

export default router;
