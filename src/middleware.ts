import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, Role } from '@/lib/auth';
import { addSecurityHeaders } from '@/lib/security';

const protectedAdminRoutes = ['/admin'];
const protectedAuthRoutes = ['/account', '/checkout'];
const roleHierarchy: Record<Role, number> = {
  CUSTOMER: 0,
  WHOLESALE: 1,
  EMPLOYEE: 2,
  MANAGER: 3,
  ADMIN: 4,
  SUPER_ADMIN: 5,
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  // Check admin routes
  if (protectedAdminRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const payload = verifyAccessToken(token);
    if (!payload || roleHierarchy[payload.role as Role] < roleHierarchy.MANAGER) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Check auth routes
  if (protectedAuthRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/checkout/:path*'],
};
