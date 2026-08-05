import mongoose from 'mongoose';

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    group: {
      type: String,
      required: [true, 'Setting group is required'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Setting key is required'],
      trim: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: [true, 'Setting value is required'],
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json'],
      default: 'string',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

settingSchema.index({ group: 1, key: 1 }, { unique: true });

settingSchema.statics.getSetting = async function (group, key, defaultValue = null) {
  const setting = await this.findOne({ group, key });
  if (!setting) return defaultValue;
  if (setting.type === 'json') {
    try {
      return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
    } catch {
      return setting.value;
    }
  }
  return setting.value;
};

settingSchema.statics.setSetting = async function (group, key, value, type = 'string', updatedBy = null) {
  return this.findOneAndUpdate(
    { group, key },
    { value, type, updatedBy },
    { upsert: true, new: true, runValidators: true }
  );
};

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
