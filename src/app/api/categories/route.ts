import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET() {
  try {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const productCounts = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
    where: { isActive: true },
  });

  const countMap = new Map(productCounts.map(c => [c.category, c._count]));

  return NextResponse.json({
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      count: countMap.get(c.slug) || 0,
    })),
  });
  } catch (error) {
    return apiError(error, 'GET /api/categories');
  }
}
