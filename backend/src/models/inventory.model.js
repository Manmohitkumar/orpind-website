import mongoose from 'mongoose';

const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse ID is required'],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    reorderPoint: {
      type: Number,
      default: 20,
      min: 0,
    },
    batchNumber: {
      type: String,
      trim: true,
    },
    manufacturingDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    costPrice: {
      type: Number,
      min: 0,
    },
    status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'in_stock',
    },
    lastRestockedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ productId: 1, warehouseId: 1 }, { unique: true });
inventorySchema.index({ sku: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

inventorySchema.virtual('availableQuantity').get(function () {
  return this.quantity - this.reservedQuantity;
});

inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

inventorySchema.virtual('needsReorder').get(function () {
  return this.quantity <= this.reorderPoint;
});

inventorySchema.pre('save', function (next) {
  const available = this.quantity - this.reservedQuantity;
  if (available <= 0) {
    this.status = 'out_of_stock';
  } else if (available <= this.lowStockThreshold) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
