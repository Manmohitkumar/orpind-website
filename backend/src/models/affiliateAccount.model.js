import mongoose from 'mongoose';

const { Schema } = mongoose;

const affiliateAccountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    affiliateCode: {
      type: String,
      required: [true, 'Affiliate code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingPayout: {
      type: Number,
      default: 0,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalReferrals: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalConversions: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    payoutMethod: {
      type: String,
      trim: true,
    },
    payoutDetails: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

affiliateAccountSchema.index({ status: 1 });

affiliateAccountSchema.virtual('conversionRate').get(function () {
  if (this.totalReferrals === 0) return 0;
  return Math.round((this.totalConversions / this.totalReferrals) * 100);
});

affiliateAccountSchema.methods.addEarnings = function (amount) {
  this.totalEarnings += amount;
  this.pendingPayout += amount;
  return this.save({ validateBeforeSave: false });
};

affiliateAccountSchema.methods.processPayout = function (amount) {
  if (amount > this.pendingPayout) {
    throw new Error('Payout amount exceeds pending balance');
  }
  this.pendingPayout -= amount;
  this.paidAmount += amount;
  return this.save();
};

const AffiliateAccount = mongoose.model('AffiliateAccount', affiliateAccountSchema);

export default AffiliateAccount;
