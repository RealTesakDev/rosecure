// app/API/roblox/Auth/v1/RegisterUser/route.ts (new file)

import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, generateUserId, generateKey, getAllUsers, updateUsers } from '@/app/lib/edge-config';

export const runtime = 'nodejs'; // Use Node.js runtime for updates

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get('username');
  const time = searchParams.get('time');

  if (!username || !time) {
    return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
  }

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return NextResponse.json({ success: false, message: 'Username already exists' }, { status: 409 });
  }

  const userId = await generateUserId();
  const key = generateKey();
  const createdAt = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const newUser: User = {
    UserID: userId,
    username,
    Hwid: '',
    Key: key,
    createdAt,
    time,
  };

  const allUsers = await getAllUsers();
  allUsers[username] = newUser;
  await updateUsers(allUsers);

  return NextResponse.json({ success: true, key, user: newUser });
}
