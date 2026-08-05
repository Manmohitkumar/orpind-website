import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import userRepository from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import config from '../config/index.js';
import { redisClient } from '../config/redis.js';
import logger from '../config/logger.js';

class AuthService {
  async register({ firstName, lastName, email, phone, password }) {
    const existingUser = await userRepository.model.findOne({ email, isDeleted: false });
    if (existingUser) {
      throw new AppError(MESSAGES.AUTH.EMAIL_EXISTS, 409);
    }

    if (phone) {
      const existingPhone = await userRepository.model.findOne({ phone, isDeleted: false });
      if (existingPhone) {
        throw new AppError(MESSAGES.AUTH.PHONE_EXISTS, 409);
      }
    }

    const user = await userRepository.model.create({ firstName, lastName, email, phone, password });

    const { accessToken, refreshToken } = await this.generateTokens(user._id);

    const refreshExpiry = this.getRefreshExpiryDate();
    await userRepository.model.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: {
          token: refreshToken,
          expiresAt: refreshExpiry,
        },
      },
      lastLoginAt: new Date(),
      $inc: { loginCount: 1 },
    });

    logger.info('User registered successfully', { userId: user._id, email });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }, { ip, userAgent }) {
    const user = await userRepository.model.findOne({ email, isDeleted: false }).select('+password');
    if (!user) {
      throw new AppError(MESSAGES.AUTH.LOGIN_FAILED, 401);
    }

    if (!user.isActive) {
      throw new AppError(MESSAGES.AUTH.ACCOUNT_DISABLED, 403);
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new AppError(MESSAGES.AUTH.ACCOUNT_LOCKED, 423);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const maxAttempts = config.maxLoginAttempts;
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= maxAttempts) {
        user.lockUntil = Date.now() + config.lockoutDuration * 60 * 1000;
        user.loginAttempts = 0;
        await user.save({ validateBeforeSave: false });
        throw new AppError(MESSAGES.AUTH.ACCOUNT_LOCKED, 423);
      }

      await user.save({ validateBeforeSave: false });
      throw new AppError(MESSAGES.AUTH.LOGIN_FAILED, 401);
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    user.$inc = { loginCount: 1 };

    const { accessToken, refreshToken } = await this.generateTokens(user._id);

    const refreshExpiry = this.getRefreshExpiryDate();
    await userRepository.model.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: {
          token: refreshToken,
          device: userAgent,
          ip,
          expiresAt: refreshExpiry,
        },
      },
      lastLoginAt: new Date(),
      $inc: { loginCount: 1 },
      loginAttempts: 0,
      lockUntil: null,
    });

    logger.info('User logged in successfully', { userId: user._id, email });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId, refreshToken) {
    await userRepository.model.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: { token: refreshToken } },
    });
    logger.info('User logged out', { userId });
    return true;
  }

  async logoutAll(userId) {
    await userRepository.model.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
    logger.info('All sessions revoked', { userId });
    return true;
  }

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new AppError(MESSAGES.AUTH.TOKEN_MISSING, 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (err) {
      throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401);
    }

    const user = await userRepository.model.findById(decoded.id).select('+refreshTokens');
    if (!user) {
      throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401);
    }

    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(user._id);

    await userRepository.model.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: { token: refreshToken } },
      $push: {
        refreshTokens: {
          token: newRefreshToken,
          expiresAt: this.getRefreshExpiryDate(),
        },
      },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async forgotPassword(email) {
    const user = await userRepository.model.findOne({ email, isDeleted: false });
    if (!user) {
      return { message: MESSAGES.AUTH.PASSWORD_RESET_SENT };
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    logger.info('Password reset token generated', { userId: user._id, email });

    return { resetToken, email };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userRepository.model.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken');

    if (!user) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_RESET_INVALID, 400);
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    logger.info('Password reset successful', { userId: user._id });

    const { accessToken, refreshToken } = await this.generateTokens(user._id);

    return { user: this.sanitizeUser(user), accessToken, refreshToken };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.model.findById(userId).select('+password');
    if (!user) {
      throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_CHANGE_FAILED, 400);
    }

    user.password = newPassword;
    user.refreshTokens = [];
    await user.save();

    logger.info('Password changed successfully', { userId });

    return true;
  }

  async verifyEmail(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userRepository.model.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(MESSAGES.AUTH.VERIFICATION_FAILED, 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    logger.info('Email verified successfully', { userId: user._id });

    return this.sanitizeUser(user);
  }

  async resendVerification(email) {
    const user = await userRepository.model.findOne({ email, isDeleted: false });
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    if (user.isEmailVerified) {
      throw new AppError(MESSAGES.AUTH.ALREADY_VERIFIED, 400);
    }

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    return { verificationToken, email };
  }

  async sendOTP(phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${phone}`;
    const client = await redisClient;
    await client.setex(key, 300, otp);

    logger.info('OTP generated', { phone });

    return { otp, phone };
  }

  async verifyOTP(phone, otp) {
    const client = await redisClient;
    const storedOtp = await client.get(`otp:${phone}`);

    if (!storedOtp) {
      throw new AppError(MESSAGES.AUTH.OTP_EXPIRED, 400);
    }

    if (storedOtp !== otp) {
      throw new AppError(MESSAGES.AUTH.OTP_INVALID, 400);
    }

    await client.del(`otp:${phone}`);

    let user = await userRepository.model.findOne({ phone, isDeleted: false });
    let isNewUser = false;

    if (!user) {
      user = await userRepository.model.create({
        firstName: 'User',
        lastName: phone.slice(-4),
        email: `${phone}@orpind.temp`,
        phone,
        password: crypto.randomBytes(16).toString('hex'),
        isPhoneVerified: true,
        isActive: true,
      });
      isNewUser = true;
    } else {
      user.isPhoneVerified = true;
      await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = await this.generateTokens(user._id);

    const refreshExpiry = this.getRefreshExpiryDate();
    await userRepository.model.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: {
          token: refreshToken,
          expiresAt: refreshExpiry,
        },
      },
      lastLoginAt: new Date(),
      $inc: { loginCount: 1 },
    });

    logger.info('OTP verified successfully', { userId: user._id, isNewUser });

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  async googleLogin(idToken) {
    logger.info('Google login attempted', { hasToken: !!idToken });
    throw new AppError('Google OAuth not configured. Please use email/password login.', 501);
  }

  async generateTokens(userId) {
    const accessToken = jwt.sign({ id: userId }, config.jwtAccessSecret, {
      expiresIn: config.jwtAccessExpiry,
    });

    const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiry,
    });

    return { accessToken, refreshToken };
  }

  setTokenCookies(res, accessToken, refreshToken) {
    const isProduction = config.nodeEnv === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  getRefreshExpiryDate() {
    const expiry = config.jwtRefreshExpiry;
    const match = expiry.match(/^(\d+)([dhm])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd': return new Date(Date.now() + value * 24 * 60 * 60 * 1000);
      case 'h': return new Date(Date.now() + value * 60 * 60 * 1000);
      case 'm': return new Date(Date.now() + value * 60 * 1000);
      default: return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  sanitizeUser(user) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    delete obj.refreshTokens;
    delete obj.passwordResetToken;
    delete obj.passwordResetExpires;
    delete obj.emailVerificationToken;
    delete obj.emailVerificationExpires;
    delete obj.__v;
    return obj;
  }
}

export default new AuthService();
