import cmsService from '../services/cms.service.js';

class CmsController {
  async getPages(req, res, next) {
    try {
      const data = await cmsService.getPages();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getPageBySlug(req, res, next) {
    try {
      const data = await cmsService.getPageBySlug(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createPage(req, res, next) {
    try {
      const data = await cmsService.createPage(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updatePage(req, res, next) {
    try {
      const data = await cmsService.updatePage(req.params.slug, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deletePage(req, res, next) {
    try {
      const data = await cmsService.deletePage(req.params.slug);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getBanners(req, res, next) {
    try {
      const data = await cmsService.getBanners();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createBanner(req, res, next) {
    try {
      const data = await cmsService.createBanner(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateBanner(req, res, next) {
    try {
      const data = await cmsService.updateBanner(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteBanner(req, res, next) {
    try {
      const data = await cmsService.deleteBanner(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getFAQs(req, res, next) {
    try {
      const data = await cmsService.getFAQs();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createFAQ(req, res, next) {
    try {
      const data = await cmsService.createFAQ(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateFAQ(req, res, next) {
    try {
      const data = await cmsService.updateFAQ(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteFAQ(req, res, next) {
    try {
      const data = await cmsService.deleteFAQ(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getTestimonials(req, res, next) {
    try {
      const data = await cmsService.getTestimonials();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async createTestimonial(req, res, next) {
    try {
      const data = await cmsService.createTestimonial(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateTestimonial(req, res, next) {
    try {
      const data = await cmsService.updateTestimonial(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteTestimonial(req, res, next) {
    try {
      const data = await cmsService.deleteTestimonial(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const cmsController = new CmsController();

export const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = cmsController;

export default cmsController;