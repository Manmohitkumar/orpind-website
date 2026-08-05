import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateTokens, setAuthCookies } from '@/lib/auth';
import { authRateLimitMiddleware } from '@/lib/security';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  // Rate limit check
  const rateLimitResponse = authRateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const foundUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!foundUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check if email is verified
    if (!foundUser.isVerified) {
      return NextResponse.json({ error: 'Please verify your email before logging in', requiresVerification: true, email: foundUser.email }, { status: 403 });
    }

    // Check if account is active
    if (!foundUser.isActive) {
      return NextResponse.json({ error: 'Account has been deactivated' }, { status: 403 });
    }

    // Generate tokens
    const role = foundUser.role.toLowerCase();
    const tokens = generateTokens(foundUser.id, foundUser.role, foundUser.email, foundUser.firstName, foundUser.lastName);

    // Create session
    await prisma.session.create({
      data: {
        userId: foundUser.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set cookies
    const response = NextResponse.json({
      user: {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        role,
        isVerified: foundUser.isVerified,
      },
      message: 'Login successful',
    });

    setAuthCookies(response, tokens);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
