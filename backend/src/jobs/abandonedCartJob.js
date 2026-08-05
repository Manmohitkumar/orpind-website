import CartItem from '../models/cartItem.model.js';
import User from '../models/user.model.js';
import emailService from '../services/email.service.js';
import Product from '../models/product.model.js';
import logger from '../config/logger.js';

const ABANDONMENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;

async function findAbandonedCarts() {
  try {
    const cutoff = new Date(Date.now() - ABANDONMENT_THRESHOLD_MS);

    const abandonedItems = await CartItem.aggregate([
      { $match: { updatedAt: { $lt: cutoff } } },
      { $group: { _id: '$userId', items: { $push: '$$ROOT' }, lastUpdated: { $max: '$updatedAt' }, itemCount: { $sum: '$quantity' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user', pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1, phone: 1 } }] } },
      { $unwind: '$user' },
      { $match: { 'user.email': { $exists: true, $ne: null } } },
    ]);

    const carts = [];
    for (const cart of abandonedItems) {
      const productIds = cart.items.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds }, isDeleted: false })
        .select('name slug price images comparePrice');

      const cartItems = cart.items.map(item => {
        const product = products.find(p => p._id.toString() === item.productId.toString());
        return {
          ...item,
          productName: product?.name,
          productSlug: product?.slug,
          price: product?.price,
          comparePrice: product?.comparePrice,
          image: product?.images?.[0],
        };
      }).filter(item => item.productName);

      if (cartItems.length > 0) {
        carts.push({
          userId: cart._id,
          user: cart.user,
          items: cartItems,
          itemCount: cart.itemCount,
          lastUpdated: cart.lastUpdated,
          total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        });
      }
    }

    logger.info('Abandoned carts found', { count: carts.length });
    return carts;
  } catch (error) {
    logger.error('Abandoned cart search failed', { error: error.message });
    throw error;
  }
}

async function sendAbandonedCartEmails(job) {
  try {
    const carts = await findAbandonedCarts();
    let sent = 0;
    let failed = 0;

    for (const cart of carts) {
      try {
        const itemsHtml = cart.items.map(item =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.productName}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${item.price}</td>
          </tr>`
        ).join('');

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h1 style="color:#2d5016">You left something behind!</h1>
            <p>Hi ${cart.user.firstName}, you have ${cart.itemCount} item(s) waiting in your cart.</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0">
              <thead>
                <tr style="background:#f5f5f5">
                  <th style="padding:8px;text-align:left">Product</th>
                  <th style="padding:8px;text-align:center">Qty</th>
                  <th style="padding:8px;text-align:right">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p style="font-size:18px;font-weight:bold">Total: ₹${cart.total.toFixed(2)}</p>
            <a href="${process.env.FRONTEND_URL || 'https://orpind.com'}/cart" style="display:inline-block;padding:12px 24px;background:#2d5016;color:#fff;text-decoration:none;border-radius:4px;margin-top:10px">Complete Your Order</a>
            <p style="color:#666;margin-top:20px;font-size:12px">Hurry! Items in your cart are subject to availability.</p>
          </div>`;

        await emailService.sendEmail({
          to: cart.user.email,
          subject: `Don't forget your items, ${cart.user.firstName}!`,
          html,
        });
        sent++;
      } catch (error) {
        failed++;
        logger.error('Abandoned cart email failed', { userId: cart.userId, error: error.message });
      }
    }

    logger.info('Abandoned cart emails sent', { sent, failed, total: carts.length });
    return { sent, failed, total: carts.length };
  } catch (error) {
    logger.error('Abandoned cart email job failed', { error: error.message });
    throw error;
  }
}

export { findAbandonedCarts, sendAbandonedCartEmails };
