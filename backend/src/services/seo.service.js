import seoRepository from '../repositories/seo.repository.js';
import productRepository from '../repositories/product.repository.js';
import categoryRepository from '../repositories/category.repository.js';
import blogRepository from '../repositories/blog.repository.js';
import recipeRepository from '../repositories/recipe.repository.js';
import config from '../config/index.js';

class SeoService {
  async getMetadata(pageType, entityId) {
    const filter = { pageType };
    if (entityId) filter.entityId = entityId;
    return seoRepository.model.findOne(filter);
  }

  async upsertMetadata(data) {
    return seoRepository.model.findOneAndUpdate(
      { pageType: data.pageType, entityId: data.entityId },
      { $set: data },
      { new: true, upsert: true }
    );
  }

  async generateSitemap() {
    const baseUrl = config.nodeEnv === 'production' ? 'https://orpind.com' : 'http://localhost:3000';
    const [products, categories, blogs, recipes] = await Promise.all([
      productRepository.model.find({ isActive: true, isDeleted: { $ne: true } }).select('slug updatedAt').lean(),
      categoryRepository.model.find({ isActive: true, isDeleted: { $ne: true } }).select('slug updatedAt').lean(),
      blogRepository.model.find({ status: 'published', isDeleted: { $ne: true } }).select('slug publishedAt').lean(),
      recipeRepository.model.find({ status: 'published', isDeleted: { $ne: true } }).select('slug updatedAt').lean(),
    ]);
    const urls = [
      { loc: baseUrl, priority: 1.0 },
      ...products.map(p => ({ loc: `${baseUrl}/shop/${p.slug}`, lastmod: p.updatedAt, priority: 0.8 })),
      ...categories.map(c => ({ loc: `${baseUrl}/shop?category=${c.slug}`, lastmod: c.updatedAt, priority: 0.7 })),
      ...blogs.map(b => ({ loc: `${baseUrl}/blog/${b.slug}`, lastmod: b.publishedAt, priority: 0.6 })),
      ...recipes.map(r => ({ loc: `${baseUrl}/recipes/${r.slug}`, lastmod: r.updatedAt, priority: 0.5 })),
    ];
    return urls;
  }

  generateProductSchema(product) {
    return { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.shortDescription, image: product.images?.[0]?.url, sku: product.sku, offers: { '@type': 'Offer', price: product.price, priceCurrency: 'INR', availability: product.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }, aggregateRating: product.averageRating ? { '@type': 'AggregateRating', ratingValue: product.averageRating, reviewCount: product.totalReviews } : undefined };
  }

  generateCategorySchema(category) {
    return { '@context': 'https://schema.org', '@type': 'CollectionPage', name: category.name, description: category.description, image: category.image?.url };
  }

  generateBlogSchema(blog) {
    return { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: blog.title, image: blog.featuredImage?.url, datePublished: blog.publishedAt, author: blog.author?.firstName };
  }

  async handleRedirect(from) {
    return seoRepository.model.findOne({ 'redirects.from': from });
  }
}

export default new SeoService();
