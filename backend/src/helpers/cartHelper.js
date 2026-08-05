const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const price = item.sellingPrice || item.price || 0;
    const quantity = item.quantity || 1;
    const itemTotal = price * quantity;
    if (item.discountType && item.discountValue) {
      let itemDiscount = 0;
      if (item.discountType === 'percentage') {
        itemDiscount = (itemTotal * item.discountValue) / 100;
      } else {
        itemDiscount = Math.min(item.discountValue, itemTotal);
      }
      return total + (itemTotal - itemDiscount);
    }
    return total + itemTotal;
  }, 0);
};

const calculateTax = (subtotal, items, shippingState) => {
  if (!subtotal || subtotal <= 0) return 0;
  const gstRates = {
    ZERO: 0,
    FIVE: 5,
    TWELVE: 12,
    EIGHTEEN: 18,
    TWENTY_EIGHT: 28,
  };
  let totalTax = 0;
  const stateCode = shippingState?.toUpperCase() || '';
  const isInterState = stateCode !== 'MH';
  if (items && Array.isArray(items)) {
    items.forEach((item) => {
      const rate = gstRates[item.gstRate] || gstRates.TWELVE;
      const itemTotal = (item.sellingPrice || item.price || 0) * (item.quantity || 1);
      const taxAmount = (itemTotal * rate) / 100;
      totalTax += taxAmount;
    });
  } else {
    totalTax = (subtotal * gstRates.TWELVE) / 100;
  }
  return Math.round(totalTax * 100) / 100;
};

const calculateShippingCost = (weight, pincode) => {
  if (!weight || weight <= 0) return 0;
  const zones = {
    local: { minDistance: 0, maxDistance: 150, baseRate: 30, perKg: 10 },
    regional: { minDistance: 150, maxDistance: 500, baseRate: 50, perKg: 20 },
    national: { minDistance: 500, maxDistance: Infinity, baseRate: 80, perKg: 35 },
  };
  let zone = 'national';
  const firstDigit = parseInt(String(pincode).charAt(0), 10);
  if (firstDigit >= 4 && firstDigit <= 6) {
    zone = 'local';
  } else if (firstDigit >= 2 && firstDigit <= 8) {
    zone = 'regional';
  }
  const rate = zones[zone];
  const cost = rate.baseRate + weight * rate.perKg;
  return Math.round(cost * 100) / 100;
};

const calculateDiscount = (subtotal, coupon) => {
  if (!coupon || !subtotal || subtotal <= 0) return 0;
  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) return 0;
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  }
  if (coupon.applicableOn === 'specific' && coupon.applicableCategories) {
    discount = 0;
  }
  return Math.round(discount * 100) / 100;
};

const calculateTotal = (subtotal, tax, shipping, discount) => {
  const total = (subtotal || 0) + (tax || 0) + (shipping || 0) - (discount || 0);
  return Math.max(0, Math.round(total * 100) / 100);
};

export { calculateSubtotal, calculateTax, calculateShippingCost, calculateDiscount, calculateTotal };
