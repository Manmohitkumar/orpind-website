import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || !product.isActive) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
  });

  return NextResponse.json({
    product: {
      ...product,
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
      reviews: reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        userName: `${r.user.firstName} ${r.user.lastName}`,
        isVerified: r.isVerified,
        helpfulCount: r.helpfulCount,
        createdAt: r.createdAt,
      })),
    },
    related,
  });
  } catch (error) {
    return apiError(error, 'GET /api/products/[slug]');
  }
}
