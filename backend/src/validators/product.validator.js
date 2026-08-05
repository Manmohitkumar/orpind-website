import Joi from "joi";

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  publicId: Joi.string().required(),
  alt: Joi.string().allow("").optional(),
  isPrimary: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().min(0).optional(),
});

const createProduct = Joi.object({
  name: Joi.string().trim().min(1).max(200).required(),
  sku: Joi.string().trim().min(1).required(),
  barcode: Joi.string().trim().optional().allow("", null),
  description: Joi.string().trim().optional().allow("", null),
  shortDescription: Joi.string().trim().max(500).optional().allow("", null),
  price: Joi.number().min(0).required(),
  comparePrice: Joi.number().min(0).optional().allow(null),
  costPrice: Joi.number().min(0).optional().allow(null),
  currency: Joi.string().length(3).uppercase().default("INR"),
  weight: Joi.number().min(0).optional().allow(null),
  weightInGrams: Joi.number().min(0).optional().allow(null),
  categoryId: Joi.string().hex().length(24).required(),
  hsnCode: Joi.string().trim().optional().allow("", null),
  gstRate: Joi.number().min(0).max(100).default(0),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  images: Joi.array().items(imageSchema).optional(),
  isFeatured: Joi.boolean().optional(),
  isNew: Joi.boolean().optional(),
  isBestseller: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  status: Joi.string().valid("draft", "active", "archived").default("draft"),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  crossSellProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  upSellProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  wholesalePrice: Joi.number().min(0).optional().allow(null),
  minOrderQuantity: Joi.number().integer().min(1).default(1),
  maxOrderQuantity: Joi.number().integer().min(1).optional().allow(null),
});

const updateProduct = Joi.object({
  name: Joi.string().trim().min(1).max(200).optional(),
  sku: Joi.string().trim().min(1).optional(),
  barcode: Joi.string().trim().optional().allow("", null),
  description: Joi.string().trim().optional().allow("", null),
  shortDescription: Joi.string().trim().max(500).optional().allow("", null),
  price: Joi.number().min(0).optional(),
  comparePrice: Joi.number().min(0).optional().allow(null),
  costPrice: Joi.number().min(0).optional().allow(null),
  currency: Joi.string().length(3).uppercase().optional(),
  weight: Joi.number().min(0).optional().allow(null),
  weightInGrams: Joi.number().min(0).optional().allow(null),
  categoryId: Joi.string().hex().length(24).optional(),
  hsnCode: Joi.string().trim().optional().allow("", null),
  gstRate: Joi.number().min(0).max(100).optional(),
  tags: Joi.array().items(Joi.string().trim().lowercase()).optional(),
  images: Joi.array().items(imageSchema).optional(),
  isFeatured: Joi.boolean().optional(),
  isNew: Joi.boolean().optional(),
  isBestseller: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  status: Joi.string().valid("draft", "active", "archived").optional(),
  metaTitle: Joi.string().trim().max(70).optional().allow("", null),
  metaDescription: Joi.string().trim().max(160).optional().allow("", null),
  relatedProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  crossSellProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  upSellProducts: Joi.array().items(Joi.string().hex().length(24)).optional(),
  wholesalePrice: Joi.number().min(0).optional().allow(null),
  minOrderQuantity: Joi.number().integer().min(1).optional(),
  maxOrderQuantity: Joi.number().integer().min(1).optional().allow(null),
});

const searchProducts = Joi.object({
  q: Joi.string().trim().optional().allow("", null),
  category: Joi.string().hex().length(24).optional(),
  sort: Joi.string()
    .valid(
      "price_asc",
      "price_desc",
      "newest",
      "oldest",
      "popular",
      "rating",
      "name_asc",
      "name_desc"
    )
    .optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(12),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  tag: Joi.string().trim().optional(),
});

export { createProduct, updateProduct, searchProducts };
