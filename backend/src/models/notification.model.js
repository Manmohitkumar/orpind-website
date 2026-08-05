import mongoose from 'mongoose';

const { Schema } = mongoose;

const channelSchema = new Schema(
  {
    sent: { type: Boolean, default: false },
    sentAt: { type: Date },
    error: { type: String },
  },
  { _id: false }
);

const inAppChannelSchema = new Schema(
  {
    sent: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { _id: false }
);

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: ['order_update', 'promo', 'system', 'stock_alert', 'review'],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    data: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    channels: {
      inApp: {
        type: inAppChannelSchema,
        default: () => ({ sent: true }),
      },
      email: {
        type: channelSchema,
        default: () => ({}),
      },
      sms: {
        type: channelSchema,
        default: () => ({}),
      },
      whatsapp: {
        type: channelSchema,
        default: () => ({}),
      },
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

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

notificationSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
