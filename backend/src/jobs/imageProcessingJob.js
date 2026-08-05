import cloudinary from '../config/cloudinary.js';
import logger from '../config/logger.js';

const THUMBNAIL_SIZES = [
  { name: 'thumb', width: 150, height: 150 },
  { name: 'small', width: 300, height: 300 },
  { name: 'medium', width: 600, height: 600 },
];

function generateThumbnailUrls(publicId, format) {
  return THUMBNAIL_SIZES.map((size) => ({
    size: size.name,
    url: cloudinary.url(publicId, {
      width: size.width,
      height: size.height,
      crop: 'fill',
      format: format || 'auto',
      quality: 'auto',
    }),
    publicId,
    width: size.width,
    height: size.height,
  }));
}

async function processProductImages(job) {
  const { mediaId, publicId, format, productId } = job.data;
  try {
    const thumbnails = generateThumbnailUrls(publicId, format);
    logger.info('Product image thumbnails generated', { mediaId, productId, count: thumbnails.length });
    return { mediaId, thumbnails };
  } catch (error) {
    logger.error('Product image processing failed', { mediaId, error: error.message });
    throw error;
  }
}

async function processAvatarImage(job) {
  const { userId, publicId, format } = job.data;
  try {
    const avatarUrl = cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      format: format || 'auto',
      quality: 'auto',
    });
    const thumbnailUrl = cloudinary.url(publicId, {
      width: 150,
      height: 150,
      crop: 'fill',
      gravity: 'face',
      format: format || 'auto',
      quality: 'auto',
    });
    logger.info('Avatar image processed', { userId });
    return { userId, avatarUrl, thumbnailUrl };
  } catch (error) {
    logger.error('Avatar image processing failed', { userId, error: error.message });
    throw error;
  }
}

async function processBlogImage(job) {
  const { mediaId, publicId, format, blogId } = job.data;
  try {
    const thumbnails = generateThumbnailUrls(publicId, format);
    const featuredUrl = cloudinary.url(publicId, {
      width: 1200,
      height: 630,
      crop: 'fill',
      format: format || 'auto',
      quality: 'auto',
    });
    logger.info('Blog image processed', { mediaId, blogId });
    return { mediaId, featuredUrl, thumbnails };
  } catch (error) {
    logger.error('Blog image processing failed', { mediaId, error: error.message });
    throw error;
  }
}

async function processGenericImage(job) {
  const { mediaId, publicId, format } = job.data;
  try {
    const thumbnails = generateThumbnailUrls(publicId, format);
    logger.info('Generic image processed', { mediaId });
    return { mediaId, thumbnails };
  } catch (error) {
    logger.error('Generic image processing failed', { mediaId, error: error.message });
    throw error;
  }
}

export {
  processProductImages,
  processAvatarImage,
  processBlogImage,
  processGenericImage,
  generateThumbnailUrls,
};
