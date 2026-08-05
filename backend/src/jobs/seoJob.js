import Product from '../models/product.model.js';
import Category from '../models/category.model.js';
import { getRedis } from '../config/redis.js';
import logger from '../config/logger.js';

const SEARCH_SUGGESTIONS_KEY = 'seo:search_suggestions';
const SITEMAP_KEY = 'seo:sitemap';
const CATEGORY_COUNTS_KEY = 'seo:category_counts';
const SUGGESTIONS_TTL = 86400;
const SITEMAP_TTL = 86400;

async function updateSearchSuggestions() {
  try {
    const redis = await getRedis();

    const products = await Product.find({ isDeleted: false, isActive: true })
      .select('name slug tags')
      .sort({ totalSold: -1 })
      .limit(500)
      .lean();

    const suggestions = new Map();

    for (const product of products) {
      const name = product.name.toLowerCase();
      const words = name.split(/\s+/);
      for (const word of words) {
        if (word.length >= 2) {
          suggestions.set(word, (suggestions.get(word) || 0) + 1);
        }
      }
      if (product.tags) {
        for (const tag of product.tags) {
          const normalizedTag = tag.toLowerCase();
          suggestions.set(normalizedTag, (suggestions.get(normalizedTag) || 0) + 1);
        }
      }
    }

    const sorted = [...suggestions.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 200)
      .map(([term, count]) => ({ term, count }));

    await redis.setex(SEARCH_SUGGESTIONS_KEY, SUGGESTIONS_TTL, JSON.stringify(sorted));
    logger.info('Search suggestions updated', { count: sorted.length });
    return { count: sorted.length };
  } catch (error) {
    logger.error('Search suggestions update failed', { error: error.message });
    throw error;
  }
}

async function generateSitemap() {
  try {
    const redis = await getRedis();
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://orpind.com' : 'http://localhost:3000';

    const [products, categories] = await Promise.all([
      Product.find({ isActive: true, isDeleted: { $ne: true } }).select('slug updatedAt').lean(),
      Category.find({ isActive: true, isDeleted: { $ne: true } }).select('slug updatedAt').lean(),
    ]);

    const urls = [
      { loc: baseUrl, priority: '1.0', changefreq: 'daily' },
      ...products.map(p => ({
        loc: `${baseUrl}/shop/${p.slug}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
        priority: '0.8',
        changefreq: 'weekly',
      })),
      ...categories.map(c => ({
        loc: `${baseUrl}/shop?category=${c.slug}`,
        lastmod: c.updatedAt ? new Date(c.updatedAt).toISOString() : undefined,
        priority: '0.7',
        changefreq: 'weekly',
      })),
    ];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    await redis.setex(SITEMAP_KEY, SITEMAP_TTL, sitemapXml);
    logger.info('Sitemap generated', { urlCount: urls.length });
    return { urlCount: urls.length, xml: sitemapXml };
  } catch (error) {
    logger.error('Sitemap generation failed', { error: error.message });
    throw error;
  }
}

async function updateCategoryProductCounts() {
  try {
    const redis = await getRedis();

    const counts = await Product.aggregate([
      { $match: { isDeleted: { $ne: true }, isActive: true } },
      { $group: { _id: '$categoryId', count: { $sum: 1 }, totalSold: { $sum: '$totalSold' } } },
      {
        $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category', pipeline: [{ $project: { name: 1, slug: 1 } }] },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    ]);

    const countMap = {};
    for (const item of counts) {
      if (item.category) {
        countMap[item.category.slug] = {
          categoryId: item._id,
          name: item.category.name,
          slug: item.category.slug,
          productCount: item.count,
          totalSold: item.totalSold || 0,
        };
      }
    }

    await redis.setex(CATEGORY_COUNTS_KEY, SUGGESTIONS_TTL, JSON.stringify(countMap));
    logger.info('Category product counts updated', { count: counts.length });
    return { categories: countMap };
  } catch (error) {
    logger.error('Category product count update failed', { error: error.message });
    throw error;
  }
}

export { updateSearchSuggestions, generateSitemap, updateCategoryProductCounts };
