import mongoose from 'mongoose';

const { Schema } = mongoose;

const referralRecordSchema = new Schema(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Referrer ID is required'],
    },
    referredId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    referralCode: {
      type: String,
      required: [true, 'Referral code is required'],
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'expired'],
      default: 'pending',
    },
    rewardPoints: {
      type: Number,
      default: 0,
      min: 0,
    },
    firstOrderAmount: {
      type: Number,
      min: 0,
    },
    referredAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

referralRecordSchema.index({ referrerId: 1 });
referralRecordSchema.index({ referredId: 1 });
referralRecordSchema.index({ referralCode: 1 });
referralRecordSchema.index({ status: 1 });

referralRecordSchema.methods.complete = function (rewardPoints, firstOrderAmount) {
  this.status = 'completed';
  this.rewardPoints = rewardPoints;
  this.firstOrderAmount = firstOrderAmount;
  this.completedAt = new Date();
  return this.save();
};

const ReferralRecord = mongoose.model('ReferralRecord', referralRecordSchema);

export default ReferralRecord;
