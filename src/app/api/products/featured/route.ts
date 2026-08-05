import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET() {
  try {
  const [featured, newArrivals, bestsellers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isBestseller: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isNew: true },
      take: 4,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestseller: true },
      take: 8,
      orderBy: { rating: 'desc' },
    }),
  ]);

  return NextResponse.json({
    featured,
    newArrivals,
    bestsellers,
    onSale: [],
  });
  } catch (error) {
    return apiError(error, 'GET /api/products/featured');
  }
}
