import mongoose from 'mongoose';

const { Schema } = mongoose;

const shipmentEventSchema = new Schema(
  {
    status: { type: String, required: true },
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
    description: { type: String },
  },
  { _id: false }
);

const dimensionSchema = new Schema(
  {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false }
);

const shipmentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
    },
    carrier: {
      type: String,
      required: [true, 'Carrier is required'],
      trim: true,
    },
    trackingNumber: {
      type: String,
      required: [true, 'Tracking number is required'],
      unique: true,
      trim: true,
    },
    trackingUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: 'pending',
    },
    weight: {
      type: Number,
      min: 0,
    },
    dimensions: {
      type: dimensionSchema,
    },
    shippingCost: {
      type: Number,
      min: 0,
    },
    estimatedDelivery: {
      type: Date,
    },
    actualDelivery: {
      type: Date,
    },
    originWarehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    events: {
      type: [shipmentEventSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ carrier: 1 });

shipmentSchema.methods.addEvent = function (status, location, description) {
  this.events.push({
    status,
    location,
    description,
    timestamp: new Date(),
  });
  this.status = status;
  return this.save();
};

const Shipment = mongoose.model('Shipment', shipmentSchema);

export default Shipment;
