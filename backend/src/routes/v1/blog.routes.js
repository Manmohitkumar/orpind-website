import { Router } from "express";
import Joi from "joi";
import { apiLimiter, validate } from "../../middleware/index.js";
import * as blogController from "../../controllers/blog.controller.js";

const slugParam = Joi.object({ slug: Joi.string().required() });
const router = Router();

router.get("/", apiLimiter, blogController.getBlogs);
router.get("/:slug", apiLimiter, validate(slugParam, "params"), blogController.getBlogBySlug);

export default router;
