import logger from '../config/logger.js';
import Shipment from '../models/shipment.model.js';
import Order from '../models/order.model.js';

const TRACKING_STATUS_MAP = {
  'picked up': 'in_transit',
  'in transit': 'in_transit',
  'out for delivery': 'out_for_delivery',
  'out_for_delivery': 'out_for_delivery',
  'delivered': 'delivered',
  'undelivered': 'failed_delivery',
  'rto': 'returned',
  'returned': 'returned',
  'pending': 'pending',
  'shipped': 'in_transit',
};

function normalizeStatus(rawStatus) {
  const lower = (rawStatus || '').toLowerCase().trim();
  return TRACKING_STATUS_MAP[lower] || lower || 'in_transit';
}

export async function handleShiprocketWebhook(req, res) {
  const { order_id, current_status, tracking_number, current_status_id, etd, scan_type, location } = req.body;

  if (!tracking_number && !order_id) {
    logger.warn('Shiprocket webhook missing identifiers');
    return res.status(400).json({ error: 'Missing required fields' });
  }

  logger.info('Shiprocket webhook received', { order_id, tracking_number, current_status });

  try {
    let shipment;
    if (tracking_number) {
      shipment = await Shipment.findOne({ tracking_number }).populate({ path: 'orderId', select: 'orderNumber userId', populate: { path: 'userId', select: 'firstName lastName email phone' } });
    }
    if (!shipment && order_id) {
      const order = await Order.findOne({ orderNumber: order_id });
      if (order) {
        shipment = await Shipment.findOne({ orderId: order._id }).populate({ path: 'orderId', select: 'orderNumber userId', populate: { path: 'userId', select: 'firstName lastName email phone' } });
      }
    }

    if (!shipment) {
      logger.warn('Shipment not found for webhook', { order_id, tracking_number });
      return res.status(200).json({ received: true, processed: false, reason: 'shipment_not_found' });
    }

    const normalizedStatus = normalizeStatus(current_status);
    const previousStatus = shipment.status;

    const eventEntry = {
      status: normalizedStatus,
      location: location || '',
      description: current_status || '',
      timestamp: new Date(),
    };

    await Shipment.findByIdAndUpdate(shipment._id, {
      $set: { status: normalizedStatus },
      $push: { events: eventEntry },
    });

    if (shipment.orderId) {
      const orderUpdates = {};
      if (normalizedStatus === 'out_for_delivery') {
        orderUpdates.status = 'out_for_delivery';
      } else if (normalizedStatus === 'delivered') {
        orderUpdates.status = 'delivered';
        orderUpdates.deliveredAt = new Date();
      } else if (normalizedStatus === 'returned' || normalizedStatus === 'returned_to_origin') {
        orderUpdates.status = 'returned';
      }

      if (orderUpdates.status) {
        await Order.findByIdAndUpdate(shipment.orderId._id, {
          $set: orderUpdates,
          $push: {
            statusHistory: {
              status: orderUpdates.status,
              timestamp: new Date(),
              note: `Shiprocket update: ${current_status}`,
            },
          },
        });
      }
    }

    if (normalizedStatus !== previousStatus && shipment.orderId?.userId) {
      logger.info('Shipment status updated via Shiprocket', {
        shipmentId: shipment._id,
        trackingNumber: shipment.trackingNumber,
        previousStatus,
        newStatus: normalizedStatus,
      });
    }

    return res.status(200).json({ received: true, processed: true, shipmentId: shipment._id });
  } catch (error) {
    logger.error('Shiprocket webhook handler error', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
