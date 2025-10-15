// app/API/roblox/Auth/v1/route.ts (new file)

import { NextRequest, NextResponse } from 'next/server';
import { getUserByKey, isKeyExpired, getAllUsers, updateUsers } from '@/app/lib/edge-config';

export const runtime = 'nodejs'; // Use Node.js runtime for updates

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hwid = searchParams.get('hwid');
  const key = searchParams.get('key');
  const userid = searchParams.get('userid');
  const gameid = searchParams.get('gameid');

  if (!hwid || !key) {
    return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
  }

  const userData = await getUserByKey(key);
  if (!userData) {
    return NextResponse.json({ success: false, message: 'Invalid key' }, { status: 401 });
  }

  const { username, user } = userData;

  if (isKeyExpired(user.createdAt, user.time)) {
    return NextResponse.json({ success: false, message: 'Key has expired' }, { status: 403 });
  }

  let needsUpdate = false;
  if (!user.Hwid) {
    user.Hwid = hwid;
    needsUpdate = true;
  } else if (user.Hwid !== hwid) {
    return NextResponse.json({ success: false, message: 'HWID mismatch' }, { status: 401 });
  }

  if (needsUpdate) {
    const allUsers = await getAllUsers();
    allUsers[username] = user;
    await updateUsers(allUsers);
  }

  return NextResponse.json({
    success: true,
    user: {
      ...user,
      userid,  // Include optional params if needed
      gameid,
    },
  });
}
