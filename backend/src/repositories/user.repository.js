import BaseRepository from './base.repository.js';
import User from '../models/user.model.js';

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase(), isDeleted: { $ne: true } }).select('+password +refreshTokens');
  }

  async findByPhone(phone) {
    return this.model.findOne({ phone, isDeleted: { $ne: true } }).select('+password +refreshTokens');
  }

  async findByIdWithPassword(id) {
    return this.model.findById(id).select('+password +refreshTokens');
  }

  async findByRefreshToken(token) {
    return this.model.findOne({ 'refreshTokens.token': token, isDeleted: { $ne: true } });
  }

  async addRefreshToken(userId, token, expiresAt) {
    return this.model.findByIdAndUpdate(userId, { $push: { refreshTokens: { token, expiresAt } } }, { new: true });
  }

  async removeRefreshToken(userId, token) {
    return this.model.findByIdAndUpdate(userId, { $pull: { refreshTokens: { token } } }, { new: true });
  }

  async clearRefreshTokens(userId) {
    return this.model.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } }, { new: true });
  }

  async updatePassword(userId, password) {
    return this.model.findByIdAndUpdate(userId, { password, passwordChangedAt: new Date() }, { new: true });
  }

  async incrementLoginAttempts(userId) {
    return this.model.findByIdAndUpdate(userId, { $inc: { loginAttempts: 1 } }, { new: true });
  }

  async lockAccount(userId, lockUntil) {
    return this.model.findByIdAndUpdate(userId, { $set: { lockedUntil: lockUntil, loginAttempts: 0 } }, { new: true });
  }

  async unlockAccount(userId) {
    return this.model.findByIdAndUpdate(userId, { $set: { loginAttempts: 0, lockedUntil: null } }, { new: true });
  }

  async updateLastLogin(userId, ip, userAgent) {
    return this.model.findByIdAndUpdate(userId, { lastLoginAt: new Date(), lastLoginIp: ip, lastLoginUserAgent: userAgent }, { new: true });
  }

  async verifyEmail(userId) {
    return this.model.findByIdAndUpdate(userId, { isEmailVerified: true, emailVerifiedAt: new Date() }, { new: true });
  }
}

export default new UserRepository();
