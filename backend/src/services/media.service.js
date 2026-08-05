import mediaRepository from '../repositories/media.repository.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class MediaService {
  async uploadFile(file, { folder = '/', alt, caption, userId }) {
    if (!file) {
      throw new AppError(MESSAGES.COMMON.FILE_REQUIRED, 400);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `media${folder === '/' ? '' : '/' + folder}`,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    const thumbnails = [];
    if (result.resource_type === 'image') {
      const thumbSizes = [
        { size: 'thumbnail', width: 150, height: 150 },
        { size: 'medium', width: 500, height: 500 },
      ];

      for (const thumb of thumbSizes) {
        const thumbUrl = cloudinary.url(result.public_id, {
          width: thumb.width,
          height: thumb.height,
          crop: 'fill',
          format: 'auto',
          quality: 'auto',
        });
        thumbnails.push({
          size: thumb.size,
          url: thumbUrl,
          publicId: result.public_id,
        });
      }
    }

    const media = await mediaRepository.model.create({
      fileName: result.public_id.split('/').pop(),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: result.secure_url,
      publicId: result.public_id,
      folder,
      width: result.width,
      height: result.height,
      format: result.format,
      thumbnails,
      alt: alt || '',
      caption: caption || '',
      uploadedBy: userId,
    });

    logger.info('Media uploaded', { mediaId: media._id, fileName: media.fileName });
    return media;
  }

  async getMediaById(mediaId) {
    const media = await mediaRepository.model.findById(mediaId);
    if (!media) {
      throw new AppError(MESSAGES.MEDIA.NOT_FOUND, 404);
    }
    return media;
  }

  async getMediaByFolder(folder = '/', { page = 1, limit = 50 } = {}) {
    const filter = { folder, isDeleted: false };
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      mediaRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      mediaRepository.model.countDocuments(filter),
    ]);

    return {
      media,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async deleteMedia(mediaId) {
    const media = await mediaRepository.model.findById(mediaId);
    if (!media) {
      throw new AppError(MESSAGES.MEDIA.NOT_FOUND, 404);
    }

    if (media.usageCount > 0) {
      throw new AppError('Cannot delete media that is in use', 400);
    }

    try {
      await cloudinary.uploader.destroy(media.publicId);
    } catch (err) {
      logger.warn('Cloudinary deletion failed, soft deleting only', { mediaId, error: err.message });
    }

    media.isDeleted = true;
    await media.save();

    logger.info('Media deleted', { mediaId });
    return true;
  }

  async restoreMedia(mediaId) {
    const media = await mediaRepository.model.findOneAndUpdate(
      { _id: mediaId, isDeleted: true },
      { $set: { isDeleted: false } },
      { new: true }
    );
    if (!media) {
      throw new AppError(MESSAGES.MEDIA.NOT_FOUND, 404);
    }
    logger.info('Media restored', { mediaId });
    return media;
  }

  async uploadMedia(user, file, opts) {
    return this.uploadFile(file, { ...opts, userId: user._id || user });
  }

  async getOrphans() {
    const orphans = await mediaRepository.model.find({ usageCount: { $lte: 0 }, isDeleted: false }).sort({ createdAt: 1 });
    return orphans;
  }
}

export default new MediaService();
