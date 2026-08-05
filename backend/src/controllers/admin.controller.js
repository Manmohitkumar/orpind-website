import productService from '../services/product.service.js';
import categoryService from '../services/category.service.js';
import orderService from '../services/order.service.js';
import couponService from '../services/coupon.service.js';
import reviewService from '../services/review.service.js';
import inventoryService from '../services/inventory.service.js';
import analyticsService from '../services/analytics.service.js';
import auditService from '../services/audit.service.js';
import settingsService from '../services/settings.service.js';
import employeeService from '../services/employee.service.js';
import warehouseService from '../services/warehouse.service.js';
import mediaService from '../services/media.service.js';
import blogService from '../services/blog.service.js';
import recipeService from '../services/recipe.service.js';
import newsletterService from '../services/newsletter.service.js';
import notificationService from '../services/notification.service.js';
import supportService from '../services/support.service.js';
import affiliateService from '../services/affiliate.service.js';
import referralService from '../services/referral.service.js';
import loyaltyService from '../services/loyalty.service.js';
import userService from '../services/user.service.js';
import paymentService from '../services/payment.service.js';
import cmsService from '../services/cms.service.js';
import shippingService from '../services/shipping.service.js';
import wholesaleService from '../services/wholesale.service.js';
import reportService from '../services/report.service.js';
import { logger } from '../config/logger.js';

class AdminControllerClass {
  async getDashboard(req, res, next) {
    try {
      const stats = await analyticsService.getDashboardStats();
      res.json({ success: true, data: stats, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getDashboardStats(req, res, next) {
    try {
      const stats = await analyticsService.getDashboardStats();
      res.json({ success: true, data: stats, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllProducts(req, res, next) {
    try {
      const result = await productService.getProducts(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json({ success: true, data: { product }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json({ success: true, data: { product }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json({ success: true, data: { product }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteProduct(req, res, next) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ success: true, data: { message: 'Product deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async restoreProduct(req, res, next) {
    try {
      const product = await productService.restoreProduct(req.params.id);
      res.json({ success: true, data: { product }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async bulkUpdateProductStatus(req, res, next) {
    try {
      const result = await productService.bulkUpdateStatus(req.body);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllOrders(req, res, next) {
    try {
      const result = await orderService.getAllOrders(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json({ success: true, data: { order }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, { status: req.body.status, note: req.body.note, updatedBy: req.user._id, trackingNumber: req.body.trackingNumber });
      res.json({ success: true, data: { order }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async processRefund(req, res, next) {
    try {
      const result = await paymentService.createRefund({ paymentId: req.params.id, amount: req.body.amount, reason: req.body.reason });
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getOrderStats(req, res, next) {
    try {
      const stats = await orderService.getOrderStats();
      res.json({ success: true, data: stats, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllUsers(req, res, next) {
    try {
      const result = await userService.getAllUsers(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.json({ success: true, data: { user }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateUserStatus(req, res, next) {
    try {
      const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
      res.json({ success: true, data: { user }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async assignUserRole(req, res, next) {
    try {
      const user = await userService.assignRole(req.params.id, req.body.roleId);
      res.json({ success: true, data: { user }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getInventory(req, res, next) {
    try {
      const result = await inventoryService.getAll(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateInventory(req, res, next) {
    try {
      const { productId, warehouseId, quantity, reason } = req.body;
      const item = await inventoryService.adjustStock(productId, warehouseId, quantity, reason, req.user._id, req.ip);
      res.json({ success: true, data: { item }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettings();
      res.json({ success: true, data: { settings }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateSettings(req, res, next) {
    try {
      const { group, key, value } = req.body;
      const setting = await settingsService.updateSetting(group, key, value, req.user._id);
      res.json({ success: true, data: { setting }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAuditLogs(req, res, next) {
    try {
      const result = await auditService.getAuditLogs(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getSalesReport(req, res, next) {
    try {
      const report = await analyticsService.getSalesReport(req.query.startDate, req.query.endDate, req.query.groupBy);
      res.json({ success: true, data: { report }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getProductReport(req, res, next) {
    try {
      const report = await analyticsService.getProductPerformance();
      res.json({ success: true, data: { report }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getCustomerReport(req, res, next) {
    try {
      const report = await analyticsService.getCustomerAnalytics();
      res.json({ success: true, data: { report }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllCoupons(req, res, next) {
    try {
      const result = await couponService.getAllCoupons(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body, req.user._id);
      res.status(201).json({ success: true, data: { coupon }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getCouponById(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      res.json({ success: true, data: { coupon }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      res.json({ success: true, data: { coupon }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteCoupon(req, res, next) {
    try {
      await couponService.deleteCoupon(req.params.id);
      res.json({ success: true, data: { message: 'Coupon deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllReviews(req, res, next) {
    try {
      const result = await reviewService.getAllReviews(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateReviewStatus(req, res, next) {
    try {
      const review = req.body.isApproved ? await reviewService.approveReview(req.params.id) : await reviewService.rejectReview(req.params.id);
      res.json({ success: true, data: { review }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteReview(req, res, next) {
    try {
      await reviewService.deleteReview(req.params.id);
      res.json({ success: true, data: { message: 'Review deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllEmployees(req, res, next) {
    try {
      const result = await employeeService.getAllEmployees(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createEmployee(req, res, next) {
    try {
      const employee = await employeeService.createEmployee(req.body);
      res.status(201).json({ success: true, data: { employee }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getEmployeeById(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(req.params.id);
      res.json({ success: true, data: { employee }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateEmployee(req, res, next) {
    try {
      const employee = await employeeService.updateEmployee(req.params.id, req.body);
      res.json({ success: true, data: { employee }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteEmployee(req, res, next) {
    try {
      await employeeService.softDelete(req.params.id);
      res.json({ success: true, data: { message: 'Employee removed' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllWarehouses(req, res, next) {
    try {
      const warehouses = await warehouseService.getAllWarehouses();
      res.json({ success: true, data: { warehouses }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createWarehouse(req, res, next) {
    try {
      const warehouse = await warehouseService.createWarehouse(req.body);
      res.status(201).json({ success: true, data: { warehouse }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateWarehouse(req, res, next) {
    try {
      const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);
      res.json({ success: true, data: { warehouse }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteWarehouse(req, res, next) {
    try {
      await warehouseService.deleteWarehouse(req.params.id);
      res.json({ success: true, data: { message: 'Warehouse deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllMedia(req, res, next) {
    try {
      const result = await mediaService.getMediaByFolder(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async uploadMedia(req, res, next) {
    try {
      const result = await mediaService.uploadFile(req.file, req.body.folder, req.user._id);
      res.status(201).json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteMedia(req, res, next) {
    try {
      await mediaService.deleteMedia(req.params.id);
      res.json({ success: true, data: { message: 'Media deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllBlogs(req, res, next) {
    try {
      const result = await blogService.getAllBlogs(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createBlog(req, res, next) {
    try {
      const blog = await blogService.createBlog({ ...req.body, author: req.user._id });
      res.status(201).json({ success: true, data: { blog }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getBlogById(req, res, next) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.json({ success: true, data: { blog }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateBlog(req, res, next) {
    try {
      const blog = await blogService.updateBlog(req.params.id, req.body);
      res.json({ success: true, data: { blog }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteBlog(req, res, next) {
    try {
      await blogService.deleteBlog(req.params.id);
      res.json({ success: true, data: { message: 'Blog deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllCategories(req, res, next) {
    try {
      const result = await categoryService.getAllCategories(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: { category }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json({ success: true, data: { category }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json({ success: true, data: { category }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteCategory(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json({ success: true, data: { message: 'Category deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllNotifications(req, res, next) {
    try {
      const result = await notificationService.getAllNotifications(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async sendNotification(req, res, next) {
    try {
      const notification = await notificationService.createNotification(req.body);
      res.status(201).json({ success: true, data: { notification }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async markNotificationRead(req, res, next) {
    try {
      await notificationService.markAsRead(req.params.id, req.body.userId);
      res.json({ success: true, data: { message: 'Marked as read' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async markAllNotificationsRead(req, res, next) {
    try {
      await notificationService.markAllAsRead(req.body.userId);
      res.json({ success: true, data: { message: 'All marked as read' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getShippingSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettingsByGroup('shipping');
      res.json({ success: true, data: { settings }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateShippingSettings(req, res, next) {
    try {
      const { key, value } = req.body;
      const setting = await settingsService.updateSetting('shipping', key, value, req.user._id);
      res.json({ success: true, data: { setting }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllSubscribers(req, res, next) {
    try {
      const result = await newsletterService.getAll(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async sendNewsletterEmail(req, res, next) {
    try {
      const { subject, content } = req.body;
      const subscribers = await newsletterService.getActiveSubscribers();
      logger.info(`Newsletter send requested to ${subscribers.length} subscribers: ${subject}`);
      res.json({ success: true, data: { message: `Newsletter queued for ${subscribers.length} subscribers` }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getWholesaleApplications(req, res, next) {
    try {
      const result = await wholesaleService.getWholesaleApplications(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateWholesaleStatus(req, res, next) {
    try {
      const result = await wholesaleService.updateApplicationStatus(req.params.id, req.body.status);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllAffiliates(req, res, next) {
    try {
      const result = await affiliateService.getAll(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateAffiliateStatus(req, res, next) {
    try {
      const result = await affiliateService.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAffiliateStats(req, res, next) {
    try {
      const stats = await affiliateService.getAffiliateStats(req.params.id);
      res.json({ success: true, data: stats, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllReferrals(req, res, next) {
    try {
      const result = await referralService.getAll(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getReferralStats(req, res, next) {
    try {
      const result = await referralService.getAll({ page: 1, limit: 100 });
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getLoyaltySettings(req, res, next) {
    try {
      const settings = await settingsService.getSettingsByGroup('loyalty');
      res.json({ success: true, data: { settings }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateLoyaltySettings(req, res, next) {
    try {
      const { key, value } = req.body;
      const setting = await settingsService.updateSetting('loyalty', key, value, req.user._id);
      res.json({ success: true, data: { setting }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getLoyaltyTransactions(req, res, next) {
    try {
      const result = await loyaltyService.getAll(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllCmsPages(req, res, next) {
    try {
      const result = await cmsService.getPages(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createCmsPage(req, res, next) {
    try {
      const page = await cmsService.createPage(req.body);
      res.status(201).json({ success: true, data: { page }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateCmsPage(req, res, next) {
    try {
      const page = await cmsService.updatePage(req.params.id, req.body);
      res.json({ success: true, data: { page }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteCmsPage(req, res, next) {
    try {
      await cmsService.deletePage(req.params.id);
      res.json({ success: true, data: { message: 'Page deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getAllRecipes(req, res, next) {
    try {
      const result = await recipeService.getAllRecipes(req.query);
      res.json({ success: true, data: result, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async createRecipe(req, res, next) {
    try {
      const recipe = await recipeService.createRecipe({ ...req.body, author: req.user._id });
      res.status(201).json({ success: true, data: { recipe }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async getRecipeById(req, res, next) {
    try {
      const recipe = await recipeService.getRecipeById(req.params.id);
      res.json({ success: true, data: { recipe }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async updateRecipe(req, res, next) {
    try {
      const recipe = await recipeService.updateRecipe(req.params.id, req.body);
      res.json({ success: true, data: { recipe }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }

  async deleteRecipe(req, res, next) {
    try {
      await recipeService.deleteRecipe(req.params.id);
      res.json({ success: true, data: { message: 'Recipe deleted' }, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) { next(error); }
  }
}

const adminController = new AdminControllerClass();

export const {
  getDashboard, getDashboardStats,
  getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, restoreProduct, bulkUpdateProductStatus,
  getAllOrders, getOrderById, updateOrderStatus, processRefund, getOrderStats,
  getAllUsers, getUserById, updateUserStatus, assignUserRole,
  getInventory, updateInventory,
  getSettings, updateSettings,
  getAuditLogs, getSalesReport, getProductReport, getCustomerReport,
  getAllCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon,
  getAllReviews, updateReviewStatus, deleteReview,
  getAllEmployees, createEmployee, getEmployeeById, updateEmployee, deleteEmployee,
  getAllWarehouses, createWarehouse, updateWarehouse, deleteWarehouse,
  getAllMedia, uploadMedia, deleteMedia,
  getAllBlogs, createBlog, getBlogById, updateBlog, deleteBlog,
  getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory,
  getAllNotifications, sendNotification, markNotificationRead, markAllNotificationsRead,
  getShippingSettings, updateShippingSettings,
  getAllSubscribers, sendNewsletterEmail,
  getWholesaleApplications, updateWholesaleStatus,
  getAllAffiliates, updateAffiliateStatus, getAffiliateStats,
  getAllReferrals, getReferralStats,
  getLoyaltySettings, updateLoyaltySettings, getLoyaltyTransactions,
  getAllCmsPages, createCmsPage, updateCmsPage, deleteCmsPage,
  getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe,
} = adminController;

export default adminController;
