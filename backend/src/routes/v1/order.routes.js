import { Router } from "express";
import {
  authenticate,
  validate,
  validateObjectId,
  checkOwnership,
  idempotency,
  apiLimiter,
} from "../../middleware/index.js";
import Order from "../../models/order.model.js";
import { createOrder, cancelOrder, returnRequest } from "../../validators/order.validator.js";
import * as orderController from "../../controllers/order.controller.js";

const router = Router();

router.post("/", authenticate, idempotency, validate(createOrder), orderController.createOrder);
router.get("/", authenticate, orderController.getOrders);
router.get("/guest/track", apiLimiter, orderController.guestTrackOrder);
router.get("/:id", authenticate, validateObjectId, checkOwnership(Order, "userId"), orderController.getOrderById);
router.post("/:id/cancel", authenticate, validateObjectId, checkOwnership(Order, "userId"), idempotency, validate(cancelOrder), orderController.cancelOrder);
router.post("/:id/return", authenticate, validateObjectId, checkOwnership(Order, "userId"), idempotency, validate(returnRequest), orderController.requestReturn);
router.get("/:id/invoice", authenticate, validateObjectId, checkOwnership(Order, "userId"), orderController.getOrderInvoice);
router.get("/:id/track", authenticate, validateObjectId, checkOwnership(Order, "userId"), orderController.trackOrder);

export default router;
