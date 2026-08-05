import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const isFeatured = searchParams.get('featured');
  const isNew = searchParams.get('new');
  const isBestseller = searchParams.get('bestseller');

  const where: any = { isActive: true };

  if (category && category !== 'all') {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search.toLowerCase() } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseInt(minPrice);
    if (maxPrice) where.price.lte = parseInt(maxPrice);
  }

  if (isFeatured === 'true') where.isFeatured = true;
  if (isNew === 'true') where.isNew = true;
  if (isBestseller === 'true') where.isBestseller = true;

  const orderBy: any = (() => {
    switch (sort) {
      case 'price-asc': return { price: 'asc' as const };
      case 'price-desc': return { price: 'desc' as const };
      case 'newest': return { createdAt: 'desc' as const };
      case 'rating': return { rating: 'desc' as const };
      default: return { isBestseller: 'desc' as const };
    }
  })();

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  const priceRange = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });

  return NextResponse.json({
    products,
    categories: categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: 0,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
    filters: {
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 10000,
      },
    },
  });
  } catch (error) {
    return apiError(error, 'GET /api/products');
  }
}
