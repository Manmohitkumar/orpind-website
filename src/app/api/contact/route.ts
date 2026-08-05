import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/validation';
import { sanitizeInput } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateRequest('contact', body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.errors?.[0] || 'Invalid input' }, { status: 400 });
    }

    const { name, email, phone, subject, message } = body;

    // Store contact form submission
    // In production, you might want a ContactSubmission model
    // For now, we'll just log and send email notification

    console.log('Contact form submission:', {
      name: sanitizeInput(name),
      email,
      phone,
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
    });

    // TODO: Send email to support team
    // await sendEmail({ to: 'support@orpind.com', subject: `New Contact: ${subject}`, html: ... });

    return NextResponse.json({
      message: 'Your message has been received. We will get back to you within 24 hours.',
      ticketId: `TKT-${Date.now().toString(36).toUpperCase()}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
