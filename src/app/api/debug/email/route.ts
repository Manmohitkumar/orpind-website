import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('to');
  if (!email) return NextResponse.json({ error: '?to=email@example.com required' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SMTP_FROM || 'Orpind <delivered@resend.dev>';

  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Orpind - Test Email',
      html: '<p>If you see this, Resend is working!</p>',
    });
    return NextResponse.json({ success: true, result, from: fromEmail, apiKeyPrefix: apiKey?.slice(0, 8) + '...' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, from: fromEmail, apiKeyPrefix: apiKey?.slice(0, 8) + '...' });
  }
}
