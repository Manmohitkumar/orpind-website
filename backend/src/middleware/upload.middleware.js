import multer from "multer";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname), false);
  }
};

const createUpload = (maxFileSize) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
  });

const uploadProduct = createUpload(10 * 1024 * 1024);
const uploadAvatar = createUpload(5 * 1024 * 1024);
const uploadBlog = createUpload(20 * 1024 * 1024);
const uploadMedia = createUpload(10 * 1024 * 1024);

export { uploadProduct, uploadAvatar, uploadBlog, uploadMedia };
