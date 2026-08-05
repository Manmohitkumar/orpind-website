import { Router } from "express";
import {
  authenticate,
  requireRole,
  requirePermission,
  validate,
  validateObjectId,
  uploadMedia,
  adminLimiter,
} from "../../middleware/index.js";
import * as adminController from "../../controllers/admin.controller.js";
import {
  createProduct,
  updateProduct,
} from "../../validators/product.validator.js";
import { createCategory, updateCategory } from "../../validators/category.validator.js";
import { createCoupon, updateCoupon } from "../../validators/coupon.validator.js";
import { createBlog, updateBlog } from "../../validators/blog.validator.js";
import { createRecipe, updateRecipe } from "../../validators/recipe.validator.js";
import { pagination, dateRange } from "../../validators/common.validator.js";

const router = Router();

router.use(authenticate, requireRole(3), adminLimiter);

router.get("/dashboard", adminController.getDashboard);
router.get("/dashboard/stats", adminController.getDashboardStats);

router.get("/products", requirePermission("PRODUCTS:READ_ALL"), adminController.getAllProducts);
router.post("/products", requirePermission("PRODUCTS:CREATE"), uploadMedia.array("images", 10), validate(createProduct), adminController.createProduct);
router.get("/products/:id", requirePermission("PRODUCTS:READ_ALL"), validateObjectId, adminController.getProductById);
router.put("/products/:id", requirePermission("PRODUCTS:UPDATE"), validateObjectId, uploadMedia.array("images", 10), validate(updateProduct), adminController.updateProduct);
router.delete("/products/:id", requirePermission("PRODUCTS:DELETE"), validateObjectId, adminController.deleteProduct);
router.patch("/products/:id/restore", requirePermission("PRODUCTS:UPDATE"), validateObjectId, adminController.restoreProduct);
router.put("/products/:id/bulk-status", requirePermission("PRODUCTS:UPDATE"), validateObjectId, adminController.bulkUpdateProductStatus);

router.get("/orders", requirePermission("ORDERS:READ_ALL"), adminController.getAllOrders);
router.get("/orders/:id", requirePermission("ORDERS:READ_ALL"), validateObjectId, adminController.getOrderById);
router.put("/orders/:id/status", requirePermission("ORDERS:UPDATE"), validateObjectId, adminController.updateOrderStatus);
router.post("/orders/:id/refund", requirePermission("ORDERS:UPDATE"), validateObjectId, adminController.processRefund);
router.get("/orders/stats", requirePermission("ORDERS:READ_ALL"), adminController.getOrderStats);

router.get("/users", requirePermission("USERS:READ_ALL"), adminController.getAllUsers);
router.get("/users/:id", requirePermission("USERS:READ_ALL"), validateObjectId, adminController.getUserById);
router.put("/users/:id/status", requirePermission("USERS:UPDATE"), validateObjectId, adminController.updateUserStatus);
router.put("/users/:id/role", requirePermission("USERS:UPDATE"), validateObjectId, adminController.assignUserRole);

router.get("/inventory", requirePermission("INVENTORY:READ_ALL"), adminController.getInventory);
router.put("/inventory/:productId", requirePermission("INVENTORY:UPDATE"), validateObjectId, adminController.updateInventory);

router.get("/settings", requirePermission("SETTINGS:READ"), adminController.getSettings);
router.put("/settings", requirePermission("SETTINGS:UPDATE"), adminController.updateSettings);

router.get("/audit-logs", requirePermission("AUDIT_LOGS:READ"), validate(pagination, "query"), adminController.getAuditLogs);

router.get("/reports/sales", requirePermission("REPORTS:READ"), validate(dateRange, "query"), adminController.getSalesReport);
router.get("/reports/products", requirePermission("REPORTS:READ"), validate(dateRange, "query"), adminController.getProductReport);
router.get("/reports/customers", requirePermission("REPORTS:READ"), validate(dateRange, "query"), adminController.getCustomerReport);

router.get("/coupons", requirePermission("COUPONS:READ_ALL"), adminController.getAllCoupons);
router.post("/coupons", requirePermission("COUPONS:CREATE"), validate(createCoupon), adminController.createCoupon);
router.get("/coupons/:id", requirePermission("COUPONS:READ_ALL"), validateObjectId, adminController.getCouponById);
router.put("/coupons/:id", requirePermission("COUPONS:UPDATE"), validateObjectId, validate(updateCoupon), adminController.updateCoupon);
router.delete("/coupons/:id", requirePermission("COUPONS:DELETE"), validateObjectId, adminController.deleteCoupon);

router.get("/reviews", requirePermission("REVIEWS:READ_ALL"), adminController.getAllReviews);
router.put("/reviews/:id/status", requirePermission("REVIEWS:UPDATE"), validateObjectId, adminController.updateReviewStatus);
router.delete("/reviews/:id", requirePermission("REVIEWS:DELETE"), validateObjectId, adminController.deleteReview);

router.get("/employees", requirePermission("EMPLOYEES:READ_ALL"), adminController.getAllEmployees);
router.post("/employees", requirePermission("EMPLOYEES:CREATE"), adminController.createEmployee);
router.get("/employees/:id", requirePermission("EMPLOYEES:READ_ALL"), validateObjectId, adminController.getEmployeeById);
router.put("/employees/:id", requirePermission("EMPLOYEES:UPDATE"), validateObjectId, adminController.updateEmployee);
router.delete("/employees/:id", requirePermission("EMPLOYEES:DELETE"), validateObjectId, adminController.deleteEmployee);

router.get("/warehouses", requirePermission("WAREHOUSES:READ_ALL"), adminController.getAllWarehouses);
router.post("/warehouses", requirePermission("WAREHOUSES:CREATE"), adminController.createWarehouse);
router.put("/warehouses/:id", requirePermission("WAREHOUSES:UPDATE"), validateObjectId, adminController.updateWarehouse);
router.delete("/warehouses/:id", requirePermission("WAREHOUSES:DELETE"), validateObjectId, adminController.deleteWarehouse);

router.get("/media", requirePermission("MEDIA:READ_ALL"), adminController.getAllMedia);
router.post("/media/upload", requirePermission("MEDIA:CREATE"), uploadMedia.single("file"), adminController.uploadMedia);
router.delete("/media/:id", requirePermission("MEDIA:DELETE"), validateObjectId, adminController.deleteMedia);

router.get("/blogs", requirePermission("BLOG:READ_ALL"), adminController.getAllBlogs);
router.post("/blogs", requirePermission("BLOG:CREATE"), validate(createBlog), adminController.createBlog);
router.get("/blogs/:id", requirePermission("BLOG:READ_ALL"), validateObjectId, adminController.getBlogById);
router.put("/blogs/:id", requirePermission("BLOG:UPDATE"), validateObjectId, validate(updateBlog), adminController.updateBlog);
router.delete("/blogs/:id", requirePermission("BLOG:DELETE"), validateObjectId, adminController.deleteBlog);

router.get("/categories", requirePermission("CATEGORIES:READ_ALL"), adminController.getAllCategories);
router.post("/categories", requirePermission("CATEGORIES:CREATE"), validate(createCategory), adminController.createCategory);
router.get("/categories/:id", requirePermission("CATEGORIES:READ_ALL"), validateObjectId, adminController.getCategoryById);
router.put("/categories/:id", requirePermission("CATEGORIES:UPDATE"), validateObjectId, validate(updateCategory), adminController.updateCategory);
router.delete("/categories/:id", requirePermission("CATEGORIES:DELETE"), validateObjectId, adminController.deleteCategory);

router.get("/notifications", requirePermission("NOTIFICATIONS:READ_ALL"), adminController.getAllNotifications);
router.post("/notifications/send", requirePermission("NOTIFICATIONS:CREATE"), adminController.sendNotification);
router.put("/notifications/:id/read", requirePermission("NOTIFICATIONS:UPDATE"), validateObjectId, adminController.markNotificationRead);
router.post("/notifications/mark-all-read", requirePermission("NOTIFICATIONS:UPDATE"), adminController.markAllNotificationsRead);

router.get("/shipping", requirePermission("SHIPPING:READ"), adminController.getShippingSettings);
router.put("/shipping", requirePermission("SHIPPING:UPDATE"), adminController.updateShippingSettings);

router.get("/newsletters", requirePermission("NEWSLETTERS:READ_ALL"), adminController.getAllSubscribers);
router.post("/newsletters/send", requirePermission("NEWSLETTERS:CREATE"), adminController.sendNewsletterEmail);

router.get("/wholesale", requirePermission("WHOLESALE:READ_ALL"), adminController.getWholesaleApplications);
router.put("/wholesale/:id/status", requirePermission("WHOLESALE:UPDATE"), validateObjectId, adminController.updateWholesaleStatus);

router.get("/affiliates", requirePermission("AFFILIATES:READ_ALL"), adminController.getAllAffiliates);
router.put("/affiliates/:id/status", requirePermission("AFFILIATES:UPDATE"), validateObjectId, adminController.updateAffiliateStatus);
router.get("/affiliates/:id/stats", requirePermission("AFFILIATES:READ_ALL"), validateObjectId, adminController.getAffiliateStats);

router.get("/referrals", requirePermission("REFERRALS:READ_ALL"), adminController.getAllReferrals);
router.get("/referrals/stats", requirePermission("REFERRALS:READ_ALL"), adminController.getReferralStats);

router.get("/loyalty", requirePermission("LOYALTY:READ"), adminController.getLoyaltySettings);
router.put("/loyalty", requirePermission("LOYALTY:UPDATE"), adminController.updateLoyaltySettings);
router.get("/loyalty/transactions", requirePermission("LOYALTY:READ_ALL"), adminController.getLoyaltyTransactions);

router.get("/cms/pages", requirePermission("CMS:READ_ALL"), adminController.getAllCmsPages);
router.post("/cms/pages", requirePermission("CMS:CREATE"), adminController.createCmsPage);
router.put("/cms/pages/:id", requirePermission("CMS:UPDATE"), validateObjectId, adminController.updateCmsPage);
router.delete("/cms/pages/:id", requirePermission("CMS:DELETE"), validateObjectId, adminController.deleteCmsPage);

router.get("/recipes", requirePermission("RECIPES:READ_ALL"), adminController.getAllRecipes);
router.post("/recipes", requirePermission("RECIPES:CREATE"), validate(createRecipe), adminController.createRecipe);
router.get("/recipes/:id", requirePermission("RECIPES:READ_ALL"), validateObjectId, adminController.getRecipeById);
router.put("/recipes/:id", requirePermission("RECIPES:UPDATE"), validateObjectId, validate(updateRecipe), adminController.updateRecipe);
router.delete("/recipes/:id", requirePermission("RECIPES:DELETE"), validateObjectId, adminController.deleteRecipe);

export default router;
