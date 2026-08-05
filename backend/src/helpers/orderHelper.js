const generateOrderNumber = (lastNumber) => {
  const prefix = 'ORD';
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const sequence = String((lastNumber || 0) + 1).padStart(5, '0');
  return `${prefix}-${datePart}-${sequence}`;
};

const calculateOrderTotals = (items, coupon, shippingAddress) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    };
  }
  let subtotal = 0;
  let totalTax = 0;
  items.forEach((item) => {
    const itemTotal = (item.sellingPrice || item.price || 0) * (item.quantity || 1);
    subtotal += itemTotal;
    const taxRate = item.gstRate || 12;
    totalTax += (itemTotal * taxRate) / 100;
  });
  let shipping = subtotal >= 499 ? 0 : 50;
  if (shippingAddress?.state?.toUpperCase() !== 'MAHARASHTRA') {
    shipping = subtotal >= 999 ? 0 : 80;
  }
  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }
  }
  const total = Math.max(0, subtotal + totalTax + shipping - discount);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(totalTax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

const getOrderStatusTimeline = (status) => {
  const timelines = {
    pending: ['pending', 'confirmed', 'processing', 'shipped', 'delivered'],
    confirmed: ['confirmed', 'processing', 'shipped', 'delivered'],
    processing: ['processing', 'shipped', 'delivered'],
    shipped: ['shipped', 'out_for_delivery', 'delivered'],
    out_for_delivery: ['out_for_delivery', 'delivered'],
    delivered: ['delivered'],
    cancelled: ['cancelled'],
    returned: ['returned'],
    refunded: ['refunded'],
    partially_refunded: ['partially_refunded'],
  };
  return timelines[status] || [];
};

const canCancel = (status) => {
  const cancellableStatuses = ['pending', 'confirmed', 'processing'];
  return cancellableStatuses.includes(status);
};

const canReturn = (status) => {
  return status === 'delivered';
};

const canRefund = (status) => {
  const refundableStatuses = ['cancelled', 'returned', 'delivered'];
  return refundableStatuses.includes(status);
};

export { generateOrderNumber, calculateOrderTotals, getOrderStatusTimeline, canCancel, canReturn, canRefund };
