import mongoose from 'mongoose';

const { Schema } = mongoose;

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Permission name is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    resource: {
      type: String,
      required: [true, 'Resource is required'],
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      enum: ['create', 'read', 'update', 'delete', 'read_all', 'manage'],
    },
    description: {
      type: String,
      trim: true,
    },
    module: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

permissionSchema.index({ resource: 1, action: 1 });

const Permission = mongoose.model('Permission', permissionSchema);

export default Permission;
