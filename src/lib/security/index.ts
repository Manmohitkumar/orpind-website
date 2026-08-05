import { NextRequest, NextResponse } from 'next/server';

// ─── Rate Limiter (In-Memory) ────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_CONFIG: RateLimitConfig = { windowMs: 60000, maxRequests: 100 };
const AUTH_CONFIG: RateLimitConfig = { windowMs: 900000, maxRequests: 10 }; // 15 min, 10 attempts
const STRICT_CONFIG: RateLimitConfig = { windowMs: 3600000, maxRequests: 5 }; // 1 hour, 5 attempts

export function checkRateLimit(key: string, config: RateLimitConfig = DEFAULT_CONFIG): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }

  if (entry.count >= config.maxRequests) return false;

  entry.count++;
  return true;
}

export function getRateLimitHeaders(key: string, config: RateLimitConfig = DEFAULT_CONFIG): Record<string, string> | undefined {
  const entry = rateLimitMap.get(key);
  if (!entry) return undefined;
  return {
    'X-RateLimit-Limit': String(config.maxRequests),
    'X-RateLimit-Remaining': String(Math.max(0, config.maxRequests - entry.count)),
    'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
  };
}

export function rateLimitMiddleware(request: NextRequest, config?: RateLimitConfig) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const key = `rl:${ip}`;
  if (!checkRateLimit(key, config)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, {
      status: 429,
      headers: getRateLimitHeaders(key, config),
    });
  }
  return null;
}

export function authRateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const key = `auth:${ip}`;
  if (!checkRateLimit(key, AUTH_CONFIG)) {
    return NextResponse.json({ error: 'Too many login attempts. Please wait 15 minutes.' }, { status: 429 });
  }
  return null;
}

// ─── Input Sanitization ──────────────────────────────
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(sanitized[key] as string);
    }
  }
  return sanitized;
}

// ─── CSRF Token Generation ───────────────────────────
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Request Validation ──────────────────────────────
export function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ─── Security Headers ────────────────────────────────
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com;");
  }
  return response;
}

// ─── CORS ────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'https://orpind.com',
  'https://www.orpind.com',
];

export function corsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get('origin') || '';
  const headers: Record<string, string> = {};
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
  headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token';
  headers['Access-Control-Allow-Credentials'] = 'true';
  headers['Access-Control-Max-Age'] = '86400';
  return headers;
}

// ─── Audit Logger ────────────────────────────────────
export async function auditLog(data: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const { default: prisma } = await import('@/lib/db');
    await prisma.auditLog.create({ data });
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

// ─── IP Geolocation (Basic Indian State Detection) ──
export function detectStateFromPincode(pincode: string): string | null {
  const prefix = parseInt(pincode.substring(0, 2));
  const stateMap: Record<number, string> = {
    11: 'Delhi', 12: 'Haryana', 13: 'Punjab', 14: 'Punjab', 15: 'Punjab',
    16: 'Chandigarh', 17: 'Himachal Pradesh', 18: 'Jammu & Kashmir',
    19: 'Jammu & Kashmir', 20: 'Uttar Pradesh', 21: 'Uttar Pradesh',
    22: 'Uttar Pradesh', 23: 'Uttar Pradesh', 24: 'Uttar Pradesh',
    25: 'Uttarakhand', 26: 'Uttarakhand', 27: 'Maharashtra',
    28: 'Andhra Pradesh', 30: 'Rajasthan', 31: 'Rajasthan',
    32: 'Kerala', 33: 'Tamil Nadu', 34: 'Tamil Nadu',
    35: 'Puducherry', 36: 'Gujarat', 37: 'Andhra Pradesh',
    38: 'Gujarat', 39: 'Gujarat', 40: 'Maharashtra',
    41: 'Maharashtra', 42: 'Maharashtra', 43: 'Maharashtra',
    44: 'Maharashtra', 45: 'Madhya Pradesh', 46: 'Madhya Pradesh',
    47: 'Madhya Pradesh', 48: 'Madhya Pradesh', 49: 'Chhattisgarh',
    50: 'Telangana', 51: 'Telangana', 52: 'Andhra Pradesh',
    53: 'Andhra Pradesh', 56: 'Karnataka', 57: 'Karnataka',
    58: 'Karnataka', 59: 'Karnataka', 60: 'Tamil Nadu',
    61: 'Tamil Nadu', 62: 'Tamil Nadu', 63: 'Tamil Nadu',
    64: 'Tamil Nadu', 65: 'Tamil Nadu', 66: 'Tamil Nadu',
    67: 'Kerala', 68: 'Kerala', 69: 'Kerala',
    70: 'West Bengal', 71: 'West Bengal', 72: 'West Bengal',
    73: 'West Bengal', 74: 'West Bengal', 75: 'Odisha',
    76: 'Odisha', 77: 'Odisha', 78: 'Assam',
    79: 'Northeast States', 80: 'Bihar', 81: 'Bihar',
    82: 'Bihar', 83: 'Bihar', 84: 'Bihar',
    85: 'Bihar', 86: 'Jharkhand', 87: 'Odisha',
  };
  return stateMap[prefix] || null;
}
