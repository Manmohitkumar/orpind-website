import { Router } from "express";
import { apiLimiter } from "../../middleware/index.js";
import * as searchController from "../../controllers/search.controller.js";

const router = Router();

router.get("/", apiLimiter, searchController.globalSearch);
router.get("/suggestions", apiLimiter, searchController.getSuggestions);

export default router;
