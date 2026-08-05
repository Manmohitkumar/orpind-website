import { Router } from "express";
import { apiLimiter } from "../../middleware/index.js";
import * as categoryController from "../../controllers/category.controller.js";

const router = Router();

router.get("/", apiLimiter, categoryController.getCategories);
router.get("/:slug", apiLimiter, categoryController.getCategoryBySlug);

export default router;
