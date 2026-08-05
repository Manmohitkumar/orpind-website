import { Router } from "express";
import { authenticate, validateObjectId } from "../../middleware/index.js";
import * as wishlistController from "../../controllers/wishlist.controller.js";

const router = Router();

router.get("/", authenticate, wishlistController.getWishlist);
router.post("/", authenticate, wishlistController.addToWishlist);
router.delete("/:productId", authenticate, validateObjectId, wishlistController.removeFromWishlist);
router.post("/move-to-cart/:productId", authenticate, validateObjectId, wishlistController.moveToCart);

export default router;
