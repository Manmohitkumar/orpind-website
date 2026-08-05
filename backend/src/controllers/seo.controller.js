import seoService from '../services/seo.service.js';

class SeoController {
  async getMetadata(req, res, next) {
    try {
      const { pageType, entityId } = req.query;
      const data = await seoService.getMetadata({ pageType, entityId });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async upsertMetadata(req, res, next) {
    try {
      const data = await seoService.upsertMetadata(req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async generateSitemap(req, res, next) {
    try {
      const data = await seoService.generateSitemap();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async handleRedirect(req, res, next) {
    try {
      const { from } = req.query;
      const data = await seoService.handleRedirect({ from });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const seoController = new SeoController();

export const {
  getMetadata,
  upsertMetadata,
  generateSitemap,
  handleRedirect,
} = seoController;

export default seoController;