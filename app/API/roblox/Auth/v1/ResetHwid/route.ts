// app/API/roblox/Auth/v1/ResetHwid/route.ts (new file)

import { NextRequest, NextResponse } from 'next/server';
import { getUserByKey, canResetHwid, getAllUsers, updateUsers } from '@/app/lib/edge-config';

export const runtime = 'nodejs'; // Use Node.js runtime for updates

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ success: false, message: 'Missing key' }, { status: 400 });
  }

  const userData = await getUserByKey(key);
  if (!userData) {
    return NextResponse.json({ success: false, message: 'Invalid key' }, { status: 401 });
  }

  const { username, user } = userData;

  if (!canResetHwid(user.lastHwidReset)) {
    return NextResponse.json({ success: false, message: 'HWID reset cooldown active (24 hours)' }, { status: 429 });
  }

  user.Hwid = '';
  user.lastHwidReset = new Date().toISOString();

  const allUsers = await getAllUsers();
  allUsers[username] = user;
  await updateUsers(allUsers);

  return NextResponse.json({ success: true, message: 'HWID reset successful' });
}
