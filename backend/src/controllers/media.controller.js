import mediaService from '../services/media.service.js';

class MediaController {
  async uploadMedia(req, res, next) {
    try {
      const { folder, alt } = req.body;
      const data = await mediaService.uploadMedia(req.user, req.file, { folder, alt });
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getMediaByFolder(req, res, next) {
    try {
      const { folder, page, limit } = req.query;
      const data = await mediaService.getMediaByFolder({ folder, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteMedia(req, res, next) {
    try {
      const data = await mediaService.deleteMedia(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async restoreMedia(req, res, next) {
    try {
      const data = await mediaService.restoreMedia(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const mediaController = new MediaController();

export const {
  uploadMedia,
  getMediaByFolder,
  deleteMedia,
  restoreMedia,
} = mediaController;

export default mediaController;