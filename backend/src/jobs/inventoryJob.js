import Inventory from '../models/inventory.model.js';
import Product from '../models/product.model.js';
import Notification from '../models/notification.model.js';
import emailService from '../services/email.service.js';
import logger from '../config/logger.js';

const LOW_STOCK_THRESHOLD = 10;
const AUTO_REORDER_THRESHOLD = 5;

async function checkLowStock() {
  try {
    const lowStockItems = await Inventory.find({
      isDeleted: false,
      $expr: { $and: [{ $gt: ['$quantity', 0] }, { $lte: ['$quantity', LOW_STOCK_THRESHOLD] }] },
    }).populate('productId', 'name sku slug images')
      .populate('warehouseId', 'name');

    const alerts = [];

    for (const item of lowStockItems) {
      if (!item.productId) continue;

      const existingAlert = await Notification.findOne({
        type: 'inventory_alert',
        'data.inventoryId': item._id.toString(),
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (!existingAlert) {
        const alert = await Notification.create({
          userId: null,
          type: 'inventory_alert',
          title: 'Low Stock Alert',
          message: `${item.productId.name} is low on stock. Current: ${item.quantity}, Warehouse: ${item.warehouseId?.name || 'N/A'}`,
          data: {
            inventoryId: item._id.toString(),
            productId: item.productId._id.toString(),
            quantity: item.quantity,
            threshold: LOW_STOCK_THRESHOLD,
            warehouseName: item.warehouseId?.name,
          },
          channels: { inApp: { sent: true, read: false } },
        });

        alerts.push(alert);
      }
    }

    if (alerts.length > 0) {
      const adminEmails = await getAdminEmails();
      for (const adminEmail of adminEmails) {
        try {
          await emailService.sendEmail({
            to: adminEmail,
            subject: `Low Stock Alert - ${alerts.length} items`,
            html: `<h1>Low Stock Alert</h1><p>${alerts.length} products are running low on stock.</p><ul>${alerts.map(a => `<li>${a.message}</li>`).join('')}</ul>`,
          });
        } catch (error) {
          logger.error('Low stock alert email failed', { error: error.message });
        }
      }
    }

    logger.info('Low stock check completed', { lowStockCount: lowStockItems.length, alertsCreated: alerts.length });
    return { lowStockCount: lowStockItems.length, alertsCreated: alerts.length };
  } catch (error) {
    logger.error('Low stock check failed', { error: error.message });
    throw error;
  }
}

async function autoReorder() {
  try {
    const criticalItems = await Inventory.find({
      isDeleted: false,
      $expr: { $lte: ['$quantity', AUTO_REORDER_THRESHOLD] },
    }).populate('productId', 'name sku slug')
      .populate('warehouseId', 'name');

    const reorderRequests = [];

    for (const item of criticalItems) {
      if (!item.productId) continue;

      const reorderQuantity = Math.max(50, (item.reorderPoint || 20) * 2);

      reorderRequests.push({
        productId: item.productId._id,
        productName: item.productId.name,
        sku: item.productId.sku,
        warehouseId: item.warehouseId?._id,
        warehouseName: item.warehouseId?.name,
        currentQuantity: item.quantity,
        reorderQuantity,
        requestedAt: new Date(),
      });

      await Notification.create({
        userId: null,
        type: 'reorder_request',
        title: 'Auto Reorder Request',
        message: `Reorder ${reorderQuantity} units of ${item.productId.name}. Current stock: ${item.quantity}`,
        data: {
          inventoryId: item._id.toString(),
          productId: item.productId._id.toString(),
          currentQuantity: item.quantity,
          reorderQuantity,
        },
        channels: { inApp: { sent: true, read: false } },
      });
    }

    if (reorderRequests.length > 0) {
      const adminEmails = await getAdminEmails();
      for (const adminEmail of adminEmails) {
        try {
          await emailService.sendEmail({
            to: adminEmail,
            subject: `Auto Reorder Required - ${reorderRequests.length} items`,
            html: `<h1>Auto Reorder Required</h1><p>${reorderRequests.length} products need restocking.</p><ul>${reorderRequests.map(r => `<li>${r.productName} (${r.sku}): ${r.currentQuantity} remaining, reorder ${r.reorderQuantity}</li>`).join('')}</ul>`,
          });
        } catch (error) {
          logger.error('Reorder alert email failed', { error: error.message });
        }
      }
    }

    logger.info('Auto reorder check completed', { itemsBelowThreshold: reorderRequests.length });
    return { reorderRequests };
  } catch (error) {
    logger.error('Auto reorder check failed', { error: error.message });
    throw error;
  }
}

async function syncProductStock() {
  try {
    const products = await Product.find({ isDeleted: false, isActive: true });

    for (const product of products) {
      const inventories = await Inventory.find({ productId: product._id, isDeleted: false });
      const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);

      if (totalStock <= 0 && product.status === 'active') {
        product.status = 'out_of_stock';
        await product.save();
        logger.info('Product marked out of stock', { productId: product._id, name: product.name });
      } else if (totalStock > 0 && product.status === 'out_of_stock') {
        product.status = 'active';
        await product.save();
        logger.info('Product restocked', { productId: product._id, name: product.name, stock: totalStock });
      }
    }

    logger.info('Product stock sync completed');
    return { synced: products.length };
  } catch (error) {
    logger.error('Product stock sync failed', { error: error.message });
    throw error;
  }
}

async function getAdminEmails() {
  const User = (await import('../models/user.model.js')).default;
  const admins = await User.find({ role: { $in: ['admin', 'superadmin'] }, isDeleted: false }).select('email');
  return admins.map(a => a.email).filter(Boolean);
}

export { checkLowStock, autoReorder, syncProductStock };
