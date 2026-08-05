import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function PUT(request: NextRequest) {
  try {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { firstName, lastName, phone } = await request.json();

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone !== undefined && { phone }),
    },
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

  return NextResponse.json({
    user: {
      ...updatedUser,
      role: updatedUser.role.toLowerCase(),
      createdAt: updatedUser.createdAt.toISOString(),
    },
  });
  } catch (error) {
    return apiError(error, 'PUT /api/user/profile');
  }
}
