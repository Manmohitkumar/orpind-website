import cmsRepository from '../repositories/cms.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class CmsService {
  async getPages({ page = 1, limit = 20 } = {}) {
    const filter = { type: 'page', isDeleted: false };
    const skip = (page - 1) * limit;
    const [pages, total] = await Promise.all([
      cmsRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      cmsRepository.model.countDocuments(filter),
    ]);
    return { pages, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getPageBySlug(slug) {
    const page = await cmsRepository.model.findOne({ slug, type: 'page', isDeleted: false });
    if (!page) throw new AppError(MESSAGES.CMS.PAGE_NOT_FOUND, 404);
    return page;
  }

  async createPage(data) {
    if (data.slug) {
      const existing = await cmsRepository.model.findOne({ slug: data.slug, isDeleted: false });
      if (existing) throw new AppError(MESSAGES.CMS.SLUG_EXISTS, 409);
    }
    const page = await cmsRepository.model.create({ ...data, type: 'page' });
    logger.info('CMS page created', { pageId: page._id });
    return page;
  }

  async updatePage(pageId, data) {
    if (data.slug) {
      const existing = await cmsRepository.model.findOne({ slug: data.slug, _id: { $ne: pageId }, isDeleted: false });
      if (existing) throw new AppError(MESSAGES.CMS.SLUG_EXISTS, 409);
    }
    const page = await cmsRepository.model.findOneAndUpdate({ _id: pageId, isDeleted: false }, { $set: data }, { new: true, runValidators: true });
    if (!page) throw new AppError(MESSAGES.CMS.PAGE_NOT_FOUND, 404);
    logger.info('CMS page updated', { pageId });
    return page;
  }

  async deletePage(pageId) {
    const page = await cmsRepository.model.findOne({ _id: pageId, type: 'page', isDeleted: false });
    if (!page) throw new AppError(MESSAGES.CMS.PAGE_NOT_FOUND, 404);
    page.isDeleted = true;
    await page.save();
    logger.info('CMS page deleted', { pageId });
    return true;
  }

  async getBanners() {
    return cmsRepository.model.find({ type: 'banner', isDeleted: false, isActive: true }).sort({ sortOrder: 1 });
  }

  async createBanner(data) {
    const banner = await cmsRepository.model.create({ ...data, type: 'banner' });
    logger.info('Banner created', { bannerId: banner._id });
    return banner;
  }

  async updateBanner(bannerId, data) {
    const banner = await cmsRepository.model.findOneAndUpdate({ _id: bannerId, type: 'banner', isDeleted: false }, { $set: data }, { new: true, runValidators: true });
    if (!banner) throw new AppError('Banner not found', 404);
    logger.info('Banner updated', { bannerId });
    return banner;
  }

  async deleteBanner(bannerId) {
    const banner = await cmsRepository.model.findOne({ _id: bannerId, type: 'banner', isDeleted: false });
    if (!banner) throw new AppError('Banner not found', 404);
    banner.isDeleted = true;
    await banner.save();
    logger.info('Banner deleted', { bannerId });
    return true;
  }

  async getFAQs() {
    return cmsRepository.model.find({ type: 'faq', isDeleted: false, isActive: true }).sort({ sortOrder: 1 });
  }

  async createFAQ(data) {
    const faq = await cmsRepository.model.create({ ...data, type: 'faq' });
    logger.info('FAQ created', { faqId: faq._id });
    return faq;
  }

  async updateFAQ(faqId, data) {
    const faq = await cmsRepository.model.findOneAndUpdate({ _id: faqId, type: 'faq', isDeleted: false }, { $set: data }, { new: true, runValidators: true });
    if (!faq) throw new AppError('FAQ not found', 404);
    logger.info('FAQ updated', { faqId });
    return faq;
  }

  async deleteFAQ(faqId) {
    const faq = await cmsRepository.model.findOne({ _id: faqId, type: 'faq', isDeleted: false });
    if (!faq) throw new AppError('FAQ not found', 404);
    faq.isDeleted = true;
    await faq.save();
    logger.info('FAQ deleted', { faqId });
    return true;
  }

  async getTestimonials() {
    return cmsRepository.model.find({ type: 'testimonial', isDeleted: false, isActive: true }).sort({ sortOrder: 1 });
  }

  async createTestimonial(data) {
    const testimonial = await cmsRepository.model.create({ ...data, type: 'testimonial' });
    logger.info('Testimonial created', { testimonialId: testimonial._id });
    return testimonial;
  }

  async updateTestimonial(testimonialId, data) {
    const testimonial = await cmsRepository.model.findOneAndUpdate({ _id: testimonialId, type: 'testimonial', isDeleted: false }, { $set: data }, { new: true, runValidators: true });
    if (!testimonial) throw new AppError('Testimonial not found', 404);
    logger.info('Testimonial updated', { testimonialId });
    return testimonial;
  }

  async deleteTestimonial(testimonialId) {
    const testimonial = await cmsRepository.model.findOne({ _id: testimonialId, type: 'testimonial', isDeleted: false });
    if (!testimonial) throw new AppError('Testimonial not found', 404);
    testimonial.isDeleted = true;
    await testimonial.save();
    logger.info('Testimonial deleted', { testimonialId });
    return true;
  }
}

export default CmsService;
