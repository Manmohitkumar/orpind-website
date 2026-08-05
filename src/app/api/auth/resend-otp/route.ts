import { NextRequest, NextResponse } from 'next/server';
import { authRateLimitMiddleware } from '@/lib/security';
import prisma from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const rateLimitResponse = authRateLimitMiddleware(request);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 });
    }

    // Invalidate old codes
    await prisma.verificationCode.updateMany({
      where: { userId: user.id, usedAt: null, type: 'EMAIL_VERIFICATION' },
      data: { expiresAt: new Date(0) },
    });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code: otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt,
      },
    });

    console.log(`\n📧 New OTP for ${email}: ${otp} (expires in 10 min)\n`);

    let emailSent = false;
    try {
      const { sendOtpEmail } = await import('@/lib/email');
      emailSent = await sendOtpEmail(email, { firstName: user.firstName, otp });
    } catch {
      // Email not configured — OTP logged above
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      message: emailSent ? 'New verification code sent' : 'OTP logged to server console (dev mode)',
      ...(isDev && !emailSent ? { devOtp: otp } : {}),
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
