import express, { Router } from "express";
import {
  authenticate,
  validate,
  validateObjectId,
  requireRole,
  idempotency,
} from "../../middleware/index.js";
import * as paymentController from "../../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", authenticate, idempotency, paymentController.createRazorpayOrder);
router.post("/verify", authenticate, idempotency, paymentController.verifyPayment);
router.post("/webhook/razorpay", paymentController.handleRazorpayWebhook);
router.post("/webhook/stripe", express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);
router.post("/:orderId/refund", authenticate, requireRole(3), validateObjectId, idempotency, paymentController.createRefund);

export default router;
