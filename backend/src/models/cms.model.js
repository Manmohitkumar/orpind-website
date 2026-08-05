import mongoose from 'mongoose';

const { Schema } = mongoose;

const cmsPageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    content: { type: String },
    type: { type: String, enum: ['page', 'faq', 'policy', 'terms'], default: 'page' },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    sortOrder: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

cmsPageSchema.index({ type: 1 });

const CMS = mongoose.model('CMSPage', cmsPageSchema);

export default CMS;
