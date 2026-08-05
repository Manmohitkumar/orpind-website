import BaseRepository from './base.repository.js';
import Recipe from '../models/recipe.model.js';

class RecipeRepository extends BaseRepository {
  constructor() {
    super(Recipe);
  }

  async findBySlug(slug) {
    return this.model.findOne({ slug, isDeleted: { $ne: true } }).populate('author', 'firstName lastName avatar');
  }

  async getPublished({ page = 1, limit = 10, cuisine, difficulty, tag } = {}) {
    const filter = { status: 'published', isDeleted: { $ne: true } };
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = { $in: [tag] };
    const skip = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      this.model.find(filter).populate('author', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { recipes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findAll({ page = 1, limit = 20, status, search } = {}) {
    const filter = { isDeleted: { $ne: true } };
    if (status) filter.status = status;
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const [recipes, total] = await Promise.all([
      this.model.find(filter).populate('author', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { recipes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new RecipeRepository();
