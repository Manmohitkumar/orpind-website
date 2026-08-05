import mongoose from 'mongoose';

const { Schema } = mongoose;

const thumbnailSchema = new Schema(
  {
    size: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const mediaSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: 0,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    folder: {
      type: String,
      trim: true,
      default: '/',
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    format: {
      type: String,
      trim: true,
    },
    thumbnails: {
      type: [thumbnailSchema],
      default: [],
    },
    alt: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

mediaSchema.index({ folder: 1 });
mediaSchema.index({ mimeType: 1 });
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ isDeleted: 1 });
mediaSchema.index({ createdAt: -1 });

mediaSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

mediaSchema.methods.softDelete = function () {
  this.isDeleted = true;
  return this.save();
};

const Media = mongoose.model('Media', mediaSchema);

export default Media;
