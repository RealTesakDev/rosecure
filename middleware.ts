// middleware.ts (new file in root)

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Optionally, parse and verify session here
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
