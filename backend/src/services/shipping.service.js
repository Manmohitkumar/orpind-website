import { logger } from '../config/logger.js';

class ShippingServiceImpl {
  async calculateShippingRate(weight, pincode) {
    const rates = [
      { minWeight: 0, maxWeight: 500, base: 40, perGram: 0.05 },
      { minWeight: 500, maxWeight: 1000, base: 60, perGram: 0.04 },
      { minWeight: 1000, maxWeight: 5000, base: 80, perGram: 0.03 },
    ];
    const zone = this.getZone(pincode);
    const rate = rates.find(r => weight >= r.minWeight && weight < r.maxWeight) || rates[rates.length - 1];
    const cost = rate.base + (weight * rate.perGram);
    const zoneMultiplier = { local: 1, regional: 1.2, national: 1.5, remote: 2 };
    return Math.round(cost * (zoneMultiplier[zone] || 1.5));
  }

  getZone(pincode) {
    const p = parseInt(pincode);
    if (p >= 110000 && p <= 119999) return 'local';
    if (p >= 100000 && p <= 199999) return 'regional';
    if (p >= 400000 && p <= 499999) return 'regional';
    return 'national';
  }

  async checkPincodeServiceability(pincode) {
    const serviceable = pincode.length === 6 && /^\d{6}$/.test(pincode);
    return { pincode, serviceable, codAvailable: serviceable, estimatedDays: serviceable ? this.getEstimatedDays(pincode) : null };
  }

  getEstimatedDays(pincode) {
    const zone = this.getZone(pincode);
    return { local: 2, regional: 4, national: 6, remote: 8 }[zone] || 6;
  }

  async getDeliveryEstimate(pincode) {
    const days = this.getEstimatedDays(pincode);
    const today = new Date();
    const deliveryBy = new Date(today);
    deliveryBy.setDate(deliveryBy.getDate() + days);
    return { estimatedDays: days, deliveryBy: deliveryBy.toISOString().split('T')[0] };
  }

  async checkShippingRate({ weight, pincode }) {
    return this.calculateShippingRate(weight, pincode);
  }

  async getShippingOptions(weight, pincode) {
    const standardRate = await this.calculateShippingRate(weight, pincode);
    const expressRate = Math.round(standardRate * 1.8);
    const deliveryEstimate = await this.getDeliveryEstimate(pincode);
    return [
      { id: 'standard', name: 'Standard Shipping', cost: standardRate, estimatedDays: deliveryEstimate },
      { id: 'express', name: 'Express Shipping', cost: expressRate, estimatedDays: Math.max(1, Math.ceil(deliveryEstimate.estimatedDays * 0.5)) },
    ];
  }
}

export default new ShippingServiceImpl();
