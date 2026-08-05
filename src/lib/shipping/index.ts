// ─── Shipping Rate Calculator ────────────────────────
// Based on weight-based pricing for Indian carriers

interface ShippingRate {
  carrier: string;
  method: string;
  cost: number;
  estimatedDays: string;
  estimatedDate: string;
}

interface WeightRate {
  maxWeight: number; // in grams
  baseCost: number;
  perKgExtra: number;
}

const SHIPPING_RATES: Record<string, WeightRate[]> = {
  standard: [
    { maxWeight: 500, baseCost: 49, perKgExtra: 0 },
    { maxWeight: 1000, baseCost: 49, perKgExtra: 25 },
    { maxWeight: 2000, baseCost: 74, perKgExtra: 20 },
    { maxWeight: 5000, baseCost: 114, perKgExtra: 15 },
    { maxWeight: 10000, baseCost: 174, perKgExtra: 12 },
    { maxWeight: 25000, baseCost: 264, perKgExtra: 10 },
    { maxWeight: 50000, baseCost: 414, perKgExtra: 8 },
  ],
  express: [
    { maxWeight: 500, baseCost: 99, perKgExtra: 0 },
    { maxWeight: 1000, baseCost: 99, perKgExtra: 50 },
    { maxWeight: 2000, baseCost: 149, perKgExtra: 40 },
    { maxWeight: 5000, baseCost: 229, perKgExtra: 30 },
    { maxWeight: 10000, baseCost: 349, perKgExtra: 25 },
    { maxWeight: 25000, baseCost: 524, perKgExtra: 20 },
    { maxWeight: 50000, baseCost: 774, perKgExtra: 15 },
  ],
};

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 999;
const FREE_SHIPPING_MIN_WEIGHT = 0;

// ─── Calculate Shipping Cost ─────────────────────────
export function calculateShippingCost(
  weightInGrams: number,
  method: 'standard' | 'express' = 'standard',
  subtotal: number = 0
): { cost: number; isFree: boolean } {
  // Free shipping for orders above threshold
  if (subtotal >= FREE_SHIPPING_THRESHOLD && weightInGrams <= 5000) {
    return { cost: 0, isFree: true };
  }

  const rates = SHIPPING_RATES[method];
  const applicableRate = rates.find(r => weightInGrams <= r.maxWeight) || rates[rates.length - 1];

  let cost = applicableRate.baseCost;
  if (weightInGrams > 1000) {
    const extraKg = (weightInGrams - 1000) / 1000;
    cost += extraKg * applicableRate.perKgExtra;
  }

  // Metro cities get slightly lower rates
  return { cost: Math.round(cost), isFree: false };
}

// ─── Estimate Delivery Date ──────────────────────────
export function estimateDeliveryDate(method: 'standard' | 'express' = 'standard', state?: string): string {
  const now = new Date();
  let days = method === 'express' ? 2 : 5;

  // Add days for distant states
  const remoteStates = ['Northeast States', 'Jammu & Kashmir', 'Ladakh', 'Andaman & Nicobar'];
  if (state && remoteStates.includes(state)) {
    days += method === 'express' ? 1 : 3;
  }

  // Add weekend buffer
  const deliveryDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  while (deliveryDate.getDay() === 0) { // Skip Sunday
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Get Shipping Options for Pincode ────────────────
export function getShippingOptions(
  pincode: string,
  subtotal: number,
  totalWeightGrams: number
): ShippingRate[] {
  const state = detectStateFromPincode(pincode);

  const options: ShippingRate[] = [];

  // Standard shipping
  const standardCost = calculateShippingCost(totalWeightGrams, 'standard', subtotal);
  options.push({
    carrier: 'Delhivery',
    method: 'standard',
    cost: standardCost.cost,
    estimatedDays: state === 'Punjab' ? '2-3 days' : '3-5 days',
    estimatedDate: estimateDeliveryDate('standard', state || undefined),
  });

  // Express shipping
  const expressCost = calculateShippingCost(totalWeightGrams, 'express', subtotal);
  options.push({
    carrier: 'Delhivery Express',
    method: 'express',
    cost: expressCost.cost,
    estimatedDays: state === 'Punjab' ? '1 day' : '1-2 days',
    estimatedDate: estimateDeliveryDate('express', state || undefined),
  });

  return options;
}

// ─── Validate Pincode ────────────────────────────────
export function isPincodeServiceable(pincode: string): boolean {
  // Currently serviceable across India via Delhivery network
  const prefix = parseInt(pincode.substring(0, 2));
  // Basic validation - 6 digits
  if (!/^[0-9]{6}$/.test(pincode)) return false;
  // Most Indian pincodes are serviceable
  return prefix >= 10 && prefix <= 87;
}

// ─── Track Shipment (placeholder for carrier API) ────
export interface TrackingInfo {
  status: string;
  location: string;
  timestamp: string;
  events: Array<{
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }>;
}

export async function trackShipment(trackingNumber: string, carrier: string): Promise<TrackingInfo | null> {
  // In production, integrate with carrier APIs (Delhivery, Shiprocket)
  // This is a placeholder
  return {
    status: 'in_transit',
    location: 'Delhi Hub',
    timestamp: new Date().toISOString(),
    events: [
      { status: 'picked_up', location: 'Phagwara, Punjab', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), description: 'Package picked up from warehouse' },
      { status: 'in_transit', location: 'Ludhiana Hub', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), description: 'Package arrived at sorting center' },
      { status: 'in_transit', location: 'Delhi Hub', timestamp: new Date().toISOString(), description: 'Package in transit to destination city' },
    ],
  };
}

// Helper function
function detectStateFromPincode(pincode: string): string | null {
  const prefix = parseInt(pincode.substring(0, 2));
  const stateMap: Record<number, string> = {
    11: 'Delhi', 12: 'Haryana', 13: 'Punjab', 14: 'Punjab', 15: 'Punjab',
    16: 'Chandigarh', 17: 'Himachal Pradesh', 18: 'Jammu & Kashmir',
    19: 'Jammu & Kashmir', 20: 'Uttar Pradesh', 21: 'Uttar Pradesh',
    22: 'Uttar Pradesh', 23: 'Uttar Pradesh', 24: 'Uttar Pradesh',
    25: 'Uttarakhand', 26: 'Uttarakhand', 27: 'Maharashtra',
    30: 'Rajasthan', 31: 'Rajasthan', 32: 'Kerala',
    33: 'Tamil Nadu', 34: 'Tamil Nadu', 35: 'Puducherry',
    36: 'Gujarat', 37: 'Andhra Pradesh', 38: 'Gujarat', 39: 'Gujarat',
    40: 'Maharashtra', 41: 'Maharashtra', 42: 'Maharashtra',
    43: 'Maharashtra', 44: 'Maharashtra', 45: 'Madhya Pradesh',
    46: 'Madhya Pradesh', 47: 'Madhya Pradesh', 48: 'Madhya Pradesh',
    49: 'Chhattisgarh', 50: 'Telangana', 51: 'Telangana',
    52: 'Andhra Pradesh', 53: 'Andhra Pradesh', 56: 'Karnataka',
    57: 'Karnataka', 58: 'Karnataka', 59: 'Karnataka',
    60: 'Tamil Nadu', 61: 'Tamil Nadu', 62: 'Tamil Nadu',
    63: 'Tamil Nadu', 64: 'Tamil Nadu', 65: 'Tamil Nadu',
    66: 'Tamil Nadu', 67: 'Kerala', 68: 'Kerala', 69: 'Kerala',
    70: 'West Bengal', 71: 'West Bengal', 72: 'West Bengal',
    73: 'West Bengal', 74: 'West Bengal', 75: 'Odisha',
    76: 'Odisha', 77: 'Odisha', 78: 'Assam',
    79: 'Northeast States', 80: 'Bihar', 81: 'Bihar',
    82: 'Bihar', 83: 'Bihar', 84: 'Bihar', 85: 'Bihar',
    86: 'Jharkhand', 87: 'Odisha',
  };
  return stateMap[prefix] || null;
}
