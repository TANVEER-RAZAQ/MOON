import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled by the in-app JWT login page.
// proxy.ts only adds noindex headers so search engines never index the admin.
export function proxy(_request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
