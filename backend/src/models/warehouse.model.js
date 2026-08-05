import mongoose from 'mongoose';

const { Schema } = mongoose;

const warehouseAddressSchema = new Schema(
  {
    addressLine1: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true, match: [/^\d{6}$/, 'Pincode must be exactly 6 digits'] },
    country: { type: String, default: 'India', trim: true },
  },
  { _id: false }
);

const warehouseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
      maxlength: 100,
    },
    code: {
      type: String,
      required: [true, 'Warehouse code is required'],
      unique: true,
      trim: true,
    },
    address: {
      type: warehouseAddressSchema,
      required: [true, 'Address is required'],
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    type: {
      type: String,
      enum: ['main', 'regional', 'fulfillment'],
      default: 'regional',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

warehouseSchema.index({ 'address.pincode': 1 });
warehouseSchema.index({ isActive: 1 });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

export default Warehouse;
