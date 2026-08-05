import recipeService from '../services/recipe.service.js';

class RecipeController {
  async getRecipes(req, res, next) {
    try {
      const { cuisine, difficulty, page, limit } = req.query;
      const data = await recipeService.getRecipes({ cuisine, difficulty, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getRecipeBySlug(req, res, next) {
    try {
      const data = await recipeService.getRecipeBySlug(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createRecipe(req, res, next) {
    try {
      const data = await recipeService.createRecipe(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateRecipe(req, res, next) {
    try {
      const data = await recipeService.updateRecipe(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteRecipe(req, res, next) {
    try {
      const data = await recipeService.deleteRecipe(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const recipeController = new RecipeController();

export const {
  getRecipes,
  getRecipeBySlug,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = recipeController;

export default recipeController;