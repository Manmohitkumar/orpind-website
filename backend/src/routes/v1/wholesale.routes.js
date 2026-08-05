import { Router } from "express";
import { authenticate, validate, requireRole } from "../../middleware/index.js";
import * as wholesaleController from "../../controllers/wholesale.controller.js";

const router = Router();

router.post("/register", authenticate, wholesaleController.registerWholesaleBuyer);
router.get("/products", authenticate, requireRole(2), wholesaleController.getWholesaleProducts);
router.post("/orders", authenticate, requireRole(2), wholesaleController.placeWholesaleOrder);

export default router;
