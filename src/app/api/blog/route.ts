import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET() {
  try {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      author: true,
      category: true,
      tags: true,
      readTime: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ posts });
  } catch (error) {
    return apiError(error, 'GET /api/blog');
  }
}
