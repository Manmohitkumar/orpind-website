import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const mockBcryptCompare = jest.fn();

jest.unstable_mockModule('bcryptjs', () => ({
  default: { compare: mockBcryptCompare },
  compare: mockBcryptCompare,
}));

const mockUserFindOne = jest.fn();
const mockUserFindById = jest.fn();
const mockUserFindByIdAndUpdate = jest.fn();
const mockUserCreate = jest.fn();
const mockSave = jest.fn().mockResolvedValue(true);
const mockToObject = jest.fn().mockReturnValue({
  _id: new mongoose.Types.ObjectId(),
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
});

jest.unstable_mockModule('../../../src/models/user.model.js', () => {
  const MockUser = function (data) {
    Object.assign(this, data);
    this._id = data._id || new mongoose.Types.ObjectId();
    this.save = mockSave;
    this.toObject = mockToObject;
  };
  MockUser.findOne = mockUserFindOne;
  MockUser.findById = mockUserFindById;
  MockUser.findByIdAndUpdate = mockUserFindByIdAndUpdate;
  MockUser.create = mockUserCreate;
  return { __esModule: true, default: MockUser };
});

const authService = (await import('../../../src/services/auth.service.js')).default;

describe('AuthService', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  describe('register', () => {
    it('should create a user and return tokens', async () => {
      const userData = { firstName: 'Test', lastName: 'User', email: 'test@test.com', password: 'Password@123' };
      mockUserFindOne.mockResolvedValue(null);
      mockUserCreate.mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        ...userData,
        isActive: true,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({ _id: new mongoose.Types.ObjectId(), ...userData }),
      });
      mockUserFindByIdAndUpdate.mockResolvedValue({});

      const result = await authService.register(userData);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(mockUserFindOne).toHaveBeenCalledWith({ email: userData.email, isDeleted: false });
    });

    it('should throw error if email already exists', async () => {
      mockUserFindOne.mockResolvedValue({ _id: new mongoose.Types.ObjectId(), email: 'existing@test.com' });
      await expect(authService.register({ email: 'existing@test.com' })).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@test.com',
        password: '$2a$12$hashedpassword',
        isActive: true,
        loginAttempts: 0,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({ _id: new mongoose.Types.ObjectId(), email: 'test@test.com' }),
      };
      mockUserFindOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
      mockUserFindByIdAndUpdate.mockResolvedValue({});
      mockBcryptCompare.mockResolvedValue(true);

      const result = await authService.login(
        { email: 'test@test.com', password: 'Password@123' },
        { ip: '127.0.0.1', userAgent: 'test-agent' }
      );
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid credentials', async () => {
      mockUserFindOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
      await expect(authService.login({ email: 'wrong@test.com', password: 'WrongPassword' }, {})).rejects.toThrow();
    });
  });

  describe('generateTokens', () => {
    it('should return access and refresh tokens', async () => {
      const tokens = await authService.generateTokens(new mongoose.Types.ObjectId());
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      const decoded = jwt.decode(tokens.accessToken);
      expect(decoded).toHaveProperty('id');
    });
  });
});
