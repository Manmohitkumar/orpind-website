import { Router } from "express";
import { validate, apiLimiter } from "../../middleware/index.js";
import { searchProducts } from "../../validators/product.validator.js";
import * as productController from "../../controllers/product.controller.js";

const router = Router();

router.get("/", apiLimiter, productController.getProducts);
router.get("/featured", apiLimiter, productController.getFeaturedProducts);
router.get("/bestsellers", apiLimiter, productController.getBestsellers);
router.get("/search", apiLimiter, validate(searchProducts, "query"), productController.searchProducts);
router.get("/autocomplete", apiLimiter, productController.autocomplete);
router.get("/:slug", apiLimiter, productController.getProductBySlug);

export default router;
