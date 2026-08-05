import userRepository from '../repositories/user.repository.js';
import addressRepository from '../repositories/address.repository.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../config/logger.js';

class UserService {
  async getProfile(userId) {
    const user = await userRepository.model.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }
    return user;
  }

  async updateProfile(userId, data) {
    const allowedFields = ['firstName', 'lastName', 'phone'];
    const updates = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updates[field] = data[field];
      }
    }

    if (updates.phone) {
      const existingPhone = await userRepository.model.findOne({ phone: updates.phone, _id: { $ne: userId }, isDeleted: false });
      if (existingPhone) {
        throw new AppError(MESSAGES.AUTH.PHONE_EXISTS, 409);
      }
    }

    const user = await userRepository.model.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    logger.info('User profile updated', { userId });
    return user;
  }

  async uploadAvatar(userId, file) {
    if (!file) {
      throw new AppError(MESSAGES.COMMON.FILE_REQUIRED, 400);
    }

    const user = await userRepository.model.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    if (user.avatar && user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    user.avatar = { url: result.secure_url, publicId: result.public_id };
    await user.save({ validateBeforeSave: false });

    logger.info('Avatar uploaded', { userId });
    return { url: result.secure_url, publicId: result.public_id };
  }

  async getAddresses(userId) {
    const addresses = await addressRepository.model.find({ userId, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 });
    return addresses;
  }

  async addAddress(userId, addressData) {
    if (addressData.isDefault) {
      await addressRepository.model.updateMany({ userId }, { isDefault: false });
    }

    const address = await addressRepository.model.create({ ...addressData, userId });

    const count = await addressRepository.model.countDocuments({ userId });
    if (count === 1) {
      address.isDefault = true;
      await address.save();
    }

    logger.info('Address added', { userId, addressId: address._id });
    return address;
  }

  async updateAddress(userId, addressId, data) {
    const address = await addressRepository.model.findOne({ _id: addressId, userId });
    if (!address) {
      throw new AppError(MESSAGES.USER.ADDRESS_DELETED, 404);
    }

    if (data.isDefault) {
      await addressRepository.model.updateMany({ userId, _id: { $ne: addressId } }, { isDefault: false });
    }

    Object.assign(address, data);
    await address.save();

    logger.info('Address updated', { userId, addressId });
    return address;
  }

  async deleteAddress(userId, addressId) {
    const address = await addressRepository.model.findOne({ _id: addressId, userId });
    if (!address) {
      throw new AppError(MESSAGES.USER.ADDRESS_DELETED, 404);
    }

    await addressRepository.model.findByIdAndDelete(addressId);

    if (address.isDefault) {
      const nextAddress = await addressRepository.model.findOne({ userId }).sort({ createdAt: -1 });
      if (nextAddress) {
        nextaddressRepository.model.isDefault = true;
        await nextaddressRepository.model.save();
      }
    }

    logger.info('Address deleted', { userId, addressId });
    return true;
  }

  async setDefaultAddress(userId, addressId) {
    const address = await addressRepository.model.findOne({ _id: addressId, userId });
    if (!address) {
      throw new AppError(MESSAGES.USER.ADDRESS_DELETED, 404);
    }

    await addressRepository.model.updateMany({ userId }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    logger.info('Default address updated', { userId, addressId });
    return address;
  }

  async getSessions(userId) {
    const user = await userRepository.model.findById(userId).select('refreshTokens');
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }
    return user.refreshTokens || [];
  }

  async revokeSession(userId, sessionIndex) {
    const user = await userRepository.model.findById(userId);
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    if (!user.refreshTokens || sessionIndex >= user.refreshTokens.length) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    user.refreshTokens.splice(sessionIndex, 1);
    await user.save({ validateBeforeSave: false });

    logger.info('Session revoked', { userId, sessionIndex });
    return user.refreshTokens;
  }

  async deleteAccount(userId, password) {
    const user = await userRepository.model.findById(userId).select('+password');
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }

    const bcrypt = (await import('bcryptjs')).default;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_CHANGE_FAILED, 400);
    }

    user.isDeleted = true;
    user.isActive = false;
    user.refreshTokens = [];
    await user.save({ validateBeforeSave: false });

    logger.info('Account deleted', { userId });
    return true;
  }

  async getUserById(userId) {
    const user = await userRepository.model.findOne({ _id: userId, isDeleted: false }).select('-refreshTokens -password');
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }
    return user;
  }

  async updateUserStatus(userId, isActive) {
    const user = await userRepository.model.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-refreshTokens -password');
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }
    logger.info('User status updated', { userId, isActive });
    return user;
  }

  async assignRole(userId, roleId) {
    const user = await userRepository.model.findByIdAndUpdate(userId, { role: roleId }, { new: true }).select('-refreshTokens -password');
    if (!user) {
      throw new AppError(MESSAGES.USER.NOT_FOUND, 404);
    }
    logger.info('Role assigned to user', { userId, roleId });
    return user;
  }

  async getAllUsers({ search, role, page = 1, limit = 20 }) {
    const filter = { isDeleted: false };
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      userRepository.model.find(filter).select('-refreshTokens -password').skip(skip).limit(limit).sort({ createdAt: -1 }),
      userRepository.model.countDocuments(filter),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new UserService();
