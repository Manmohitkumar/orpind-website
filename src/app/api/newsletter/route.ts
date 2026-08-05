import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Thank you for subscribing! Check your email for a welcome offer.',
  }, { status: 201 });
}
