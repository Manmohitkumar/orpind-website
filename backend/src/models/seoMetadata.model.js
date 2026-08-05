import mongoose from 'mongoose';

const { Schema } = mongoose;

const redirectSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { _id: false }
);

const seoMetadataSchema = new Schema(
  {
    pageType: {
      type: String,
      required: [true, 'Page type is required'],
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    ogTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    ogDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    ogImage: {
      type: String,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    structuredData: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    noIndex: {
      type: Boolean,
      default: false,
    },
    noFollow: {
      type: Boolean,
      default: false,
    },
    redirects: {
      type: [redirectSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

seoMetadataSchema.index({ pageType: 1, entityId: 1 }, { unique: true });
seoMetadataSchema.index({ slug: 1 });

const SeoMetadata = mongoose.model('SeoMetadata', seoMetadataSchema);

export default SeoMetadata;
