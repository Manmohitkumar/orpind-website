import { NextRequest, NextResponse } from 'next/server';
import { getShippingOptions, isPincodeServiceable } from '@/lib/shipping';

export async function POST(request: NextRequest) {
  const { pincode, subtotal, totalWeight } = await request.json();

  if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  if (!isPincodeServiceable(pincode)) {
    return NextResponse.json({
      available: false,
      message: 'Sorry, we do not deliver to this pincode yet.',
    });
  }

  const options = getShippingOptions(
    pincode,
    subtotal || 0,
    totalWeight || 500 // Default 500g
  );

  return NextResponse.json({
    available: true,
    pincode,
    deliveryOptions: options,
  });
}
