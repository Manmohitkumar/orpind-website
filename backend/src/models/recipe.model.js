import mongoose from 'mongoose';

const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    productName: { type: String, required: true, trim: true },
    quantity: { type: String, required: true, trim: true },
    isOptional: { type: Boolean, default: false },
  },
  { _id: false }
);

const recipeImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
  },
  { _id: false }
);

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    featuredImage: {
      url: { type: String },
      publicId: { type: String },
    },
    ingredients: {
      type: [ingredientSchema],
      default: [],
    },
    instructions: [
      {
        type: String,
        trim: true,
      },
    ],
    prepTime: {
      type: Number,
      min: 0,
    },
    cookTime: {
      type: Number,
      min: 0,
    },
    totalTime: {
      type: Number,
      min: 0,
    },
    servings: {
      type: Number,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    cuisine: {
      type: String,
      trim: true,
    },
    images: {
      type: [recipeImageSchema],
      default: [],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.index({ author: 1 });
recipeSchema.index({ status: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ difficulty: 1 });

recipeSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.isModified('title') && this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  if (this.prepTime && this.cookTime) {
    this.totalTime = this.prepTime + this.cookTime;
  }
  next();
});

recipeSchema.pre('save', function (next) {
  if (!this.slug && this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

recipeSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save({ validateBeforeSave: false });
};

recipeSchema.methods.incrementLikeCount = function () {
  this.likeCount += 1;
  return this.save({ validateBeforeSave: false });
};

recipeSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.status = 'draft';
  return this.save();
};

recipeSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
