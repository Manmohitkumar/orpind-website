import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
  const user = await getUserFromRequest(request);

  if (user) {
    // Delete all sessions for this user
    await prisma.session.deleteMany({ where: { userId: user.id } });
  }

  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');

  return response;
  } catch (error) {
    return apiError(error, 'POST /api/auth/logout');
  }
}
