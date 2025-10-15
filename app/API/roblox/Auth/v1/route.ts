import { NextRequest, NextResponse } from 'next/server';
import { getUserByKey, isKeyExpired, getAllUsers, updateUsers } from '@/app/lib/edge-config';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ success: false, message: 'Missing key parameter' }, { status: 400 });
  }

  const user = await getUserByKey(key);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid key' }, { status: 404 });
  }

  if (isKeyExpired(key)) {
    return NextResponse.json({ success: false, message: 'Key has expired' }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
