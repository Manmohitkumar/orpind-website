import shippingService from '../services/shipping.service.js';

class ShippingController {
  async checkShippingRate(req, res, next) {
    try {
      const { weight, pincode } = req.body;
      const data = await shippingService.checkShippingRate({ weight, pincode });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async checkPincodeServiceability(req, res, next) {
    try {
      const data = await shippingService.checkPincodeServiceability(req.params.pincode);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getDeliveryEstimate(req, res, next) {
    try {
      const data = await shippingService.getDeliveryEstimate(req.params.pincode);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const shippingController = new ShippingController();

export const {
  checkShippingRate,
  checkPincodeServiceability,
  getDeliveryEstimate,
} = shippingController;

export default shippingController;