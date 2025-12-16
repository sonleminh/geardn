import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = [/^\/user/, /^\/orders/];
const AUTH_ONLY = [/^\/login(?:\/|$)/, /^\/signup(?:\/|$)/];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED.some(rx => rx.test(path));
  const isAuthOnly = AUTH_ONLY.some(rx => rx.test(path));
  if (!isProtected && !isAuthOnly) return;

  // ping whoami trên BFF (ít tốn vì cùng origin)
  const r = await fetch(new URL('/api/bff/auth/whoami', req.url), { headers: { cookie: req.headers.get('cookie') ?? '' } });

  if (isAuthOnly) {
    if (r.status === 200) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return; // not logged in => allow access to login/signup
  }

   if (isProtected && r.status !== 200) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/user/:path*', '/orders/:path*', '/login', '/signup'],
}