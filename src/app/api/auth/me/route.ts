import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!fullUser) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      ...fullUser,
      role: fullUser.role.toLowerCase(),
      createdAt: fullUser.createdAt.toISOString(),
    },
  });
  } catch (error) {
    return apiError(error, 'GET /api/auth/me');
  }
}
