import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'orpind-dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'orpind-dev-refresh-secret-change';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Password Hashing ───────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ─── Token Generation ───────────────────────────────
export function generateTokens(userId: string, role: string, email = '', firstName = '', lastName = ''): TokenPair {
  const payload: JWTPayload = { userId, role, email, firstName, lastName };
  return {
    accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any }),
    refreshToken: jwt.sign({ ...payload, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as any }),
  };
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN as any });
}

export function generateTokenPair(payload: JWTPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

// ─── JWT Verification ───────────────────────────────
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): (JWTPayload & { type: string }) | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload & { type: string };
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch {
    return null;
  }
}

// ─── Cookie Management (Server Components) ──────────
export async function setAuthCookiesServer(accessToken: string, refreshToken: string) {
  const store = await cookies();
  store.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
  store.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

// ─── Cookie Management (Route Handlers) ─────────────
export function setAuthCookies(response: NextResponse, tokens: TokenPair): NextResponse {
  response.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
  response.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete('access_token');
  store.delete('refresh_token');
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const store = await cookies();
  const token = store.get('access_token')?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

// ─── Request Auth Extraction ─────────────────────────
export function extractUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export function getUserFromRequest(request: NextRequest): Promise<{ id: string; firstName: string; lastName: string; email: string; phone: string | null; role: string } | null> {
  const token = request.cookies.get('access_token')?.value;
  if (!token) return Promise.resolve(null);

  const payload = verifyAccessToken(token);
  if (!payload) return Promise.resolve(null);

  return Promise.resolve({
    id: payload.userId,
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload.email,
    phone: null,
    role: payload.role,
  });
}

// ─── Password Validation ─────────────────────────────
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
  return { valid: errors.length === 0, errors };
}

// ─── Role-Based Access Control ───────────────────────
export type Role = 'CUSTOMER' | 'WHOLESALE' | 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';

const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 0,
  WHOLESALE: 1,
  EMPLOYEE: 2,
  MANAGER: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export function hasPermission(userRole: string, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as Role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] ?? 0;
  return userLevel >= requiredLevel;
}

export function isAdmin(userRole: string): boolean {
  return userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';
}
