import recipeRepository from '../repositories/recipe.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class RecipeService {
  async getPublishedRecipes({ page = 1, limit = 10, cuisine, difficulty, search, tags } = {}) {
    const filter = { status: 'published', isDeleted: false };
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      recipeRepository.model.find(filter)
        .populate('author', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      recipeRepository.model.countDocuments(filter),
    ]);

    return {
      recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRecipeBySlug(slug) {
    const recipe = await recipeRepository.model.findOne({ slug, isDeleted: false })
      .populate('author', 'firstName lastName avatar');
    if (!recipe) {
      throw new AppError(MESSAGES.RECIPE.NOT_FOUND, 404);
    }

    await recipeRepository.model.findOneAndUpdate(
      { _id: recipe._id },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    return recipe;
  }

  async createRecipe(data) {
    if (data.title) {
      const existing = await recipeRepository.model.findOne({ title: data.title, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.RECIPE.ALREADY_EXISTS, 409);
      }
    }

    if (data.prepTime && data.cookTime) {
      data.totalTime = data.prepTime + data.cookTime;
    }

    const recipe = await recipeRepository.model.create(data);
    logger.info('Recipe created', { recipeId: recipe._id, title: recipe.title });
    return recipe;
  }

  async updateRecipe(recipeId, data) {
    if (data.title) {
      const existing = await recipeRepository.model.findOne({ title: data.title, _id: { $ne: recipeId }, isDeleted: false });
      if (existing) {
        throw new AppError(MESSAGES.RECIPE.ALREADY_EXISTS, 409);
      }
    }

    if (data.prepTime && data.cookTime) {
      data.totalTime = data.prepTime + data.cookTime;
    }

    const recipe = await recipeRepository.model.findOneAndUpdate(
      { _id: recipeId, isDeleted: false },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      throw new AppError(MESSAGES.RECIPE.NOT_FOUND, 404);
    }

    logger.info('Recipe updated', { recipeId });
    return recipe;
  }

  async getRecipes(query) {
    return this.getPublishedRecipes(query);
  }

  async getAllRecipes({ page = 1, limit = 20, cuisine, difficulty, search, status } = {}) {
    const filter = { isDeleted: false };
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      recipeRepository.model.find(filter).populate('author', 'firstName lastName avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      recipeRepository.model.countDocuments(filter),
    ]);
    return { recipes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getRecipeById(recipeId) {
    const recipe = await recipeRepository.model.findOne({ _id: recipeId, isDeleted: false }).populate('author', 'firstName lastName avatar');
    if (!recipe) {
      throw new AppError(MESSAGES.RECIPE.NOT_FOUND, 404);
    }
    return recipe;
  }

  async deleteRecipe(recipeId) {
    const recipe = await recipeRepository.model.findById(recipeId);
    if (!recipe) {
      throw new AppError(MESSAGES.RECIPE.NOT_FOUND, 404);
    }

    await recipe.softDelete();
    logger.info('Recipe deleted', { recipeId });
    return true;
  }
}

export default new RecipeService();
