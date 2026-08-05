import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { validateRequest } from '@/lib/validation';
import { authRateLimitMiddleware } from '@/lib/security';
import prisma from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const rateLimitResponse = authRateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();

    const validation = validateRequest('register', body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.errors?.[0] || 'Invalid input' }, { status: 400 });
    }

    const { firstName, lastName, email, password, phone } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || null,
        role: 'CUSTOMER',
        isVerified: false,
        isActive: true,
      },
    });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Invalidate old unused codes for this user
    await prisma.verificationCode.updateMany({
      where: { userId: user.id, usedAt: null, type: 'EMAIL_VERIFICATION' },
      data: { expiresAt: new Date(0) },
    });

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    });

    // Send OTP (log to console in dev since no email service configured)
    console.log(`\n📧 OTP for ${email}: ${otp} (expires in 10 min)\n`);

    let emailSent = false;
    try {
      const { sendOtpEmail } = await import('@/lib/email');
      emailSent = await sendOtpEmail(email, { firstName, otp });
      if (!emailSent) console.error('sendOtpEmail returned false');
    } catch (err) {
      console.error('sendOtpEmail threw:', err);
    }

    return NextResponse.json({
      requiresVerification: true,
      email: user.email,
      message: emailSent ? 'Verification code sent to your email' : 'OTP shown below (dev mode)',
      devOtp: otp,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
