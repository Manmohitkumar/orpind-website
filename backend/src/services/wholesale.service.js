import productRepository from '../repositories/product.repository.js';
import orderRepository from '../repositories/order.repository.js';
import userRepository from '../repositories/user.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

class WholesaleService {
  async getWholesaleProducts({ page = 1, limit = 20 } = {}) {
    const filter = { wholesalePrice: { $gt: 0 }, isActive: true, isDeleted: { $ne: true } };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      productRepository.model.find(filter).populate('categoryId', 'name slug').skip(skip).limit(limit),
      productRepository.model.countDocuments(filter),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async placeWholesaleOrder(userId, { items, addressId, notes }) {
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await productRepository.model.findById(item.productId);
      if (!product) throw new AppError(`Product not found: ${item.productId}`, 404);
      if (item.quantity < (product.minOrderQuantity || 1)) throw new AppError(`Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`, 400);
      const price = product.wholesalePrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({ productId: product._id, productName: product.name, sku: product.sku, price, quantity: item.quantity, weight: product.weight, images: product.images.map(i => i.url), itemTotal, hsnCode: product.hsnCode, gstRate: product.gstRate });
    }
    const count = await orderRepository.model.countDocuments();
    const orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    return orderRepository.model.create({ orderNumber, userId, items: orderItems, subtotal, tax, total, status: 'pending', paymentStatus: 'pending', notes, metadata: { type: 'wholesale' } });
  }

  async registerWholesaleBuyer(userId, data) {
    return userRepository.model.findByIdAndUpdate(userId, { $set: { metadata: { ...data, wholesaleApproved: false, wholesaleAppliedAt: new Date() } } }, { new: true });
  }

  async getWholesaleApplications({ page = 1, limit = 20, status } = {}) {
    const filter = { 'metadata.type': 'wholesale' };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [applications, total] = await Promise.all([
      userRepository.model.find({ 'metadata.wholesaleAppliedAt': { $exists: true } }).select('-refreshTokens -password').sort({ 'metadata.wholesaleAppliedAt': -1 }).skip(skip).limit(limit),
      userRepository.model.countDocuments({ 'metadata.wholesaleAppliedAt': { $exists: true } }),
    ]);
    return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateApplicationStatus(id, status) {
    const user = await userRepository.model.findByIdAndUpdate(id, { 'metadata.wholesaleApproved': status === 'approved' }, { new: true }).select('-refreshTokens -password');
    if (!user) throw new AppError('Wholesale application not found', 404);
    return user;
  }
}

export default new WholesaleService();
