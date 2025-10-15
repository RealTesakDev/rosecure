// app/API/Web/Auth/v1/Login/route.ts (new file)

import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/app/lib/edge-config';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get('username');
  const key = searchParams.get('key');

  if (!username || !key) {
    return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
  }

  const user = await getUserByUsername(username);
  if (!user || user.Key !== key) {
    return NextResponse.json({ success: false, message: 'Invalid username or key' }, { status: 401 });
  }

  // Set session cookie (even if key expired)
  const response = NextResponse.json({ success: true, user });
  response.cookies.set('session', JSON.stringify({ username, key }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return response;
}
