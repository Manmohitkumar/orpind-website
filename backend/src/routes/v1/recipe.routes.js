import { Router } from "express";
import Joi from "joi";
import { apiLimiter, validate } from "../../middleware/index.js";
import * as recipeController from "../../controllers/recipe.controller.js";

const slugParam = Joi.object({ slug: Joi.string().required() });
const router = Router();

router.get("/", apiLimiter, recipeController.getRecipes);
router.get("/:slug", apiLimiter, validate(slugParam, "params"), recipeController.getRecipeBySlug);

export default router;
