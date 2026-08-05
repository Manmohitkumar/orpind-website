import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
  const { couponCode, subtotal } = await request.json();

  if (!couponCode) {
    return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
  }

  const coupon = await prisma.coupon.findFirst({
    where: {
      code: couponCode.toUpperCase(),
      isActive: true,
      validUntil: { gt: new Date() },
    },
  });

  if (!coupon) {
    return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 400 });
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return NextResponse.json({
      error: `Minimum order amount is ₹${coupon.minOrderAmount}`,
    }, { status: 400 });
  }

  if (coupon.usageLimit !== -1 && coupon.usedCount >= coupon.usageLimit) {
    return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
  }

  let discount = 0;
  const discountType = coupon.discountType.toUpperCase();
  if (discountType === 'PERCENTAGE') {
    discount = Math.min(
      Math.round((subtotal * coupon.discountValue) / 100),
      coupon.maxDiscount || Infinity
    );
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return NextResponse.json({
    valid: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
    discount,
    message: `Coupon applied! You save ₹${discount}`,
  });
  } catch (error) {
    return apiError(error, 'POST /api/coupons/validate');
  }
}
