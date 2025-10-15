import { NextRequest, NextResponse } from 'next/server';
import { getUserByKey, canResetHwid, getAllUsers, updateUsers } from '@/app/lib/edge-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { key, newHwid } = await request.json();

  if (!key || !newHwid) {
    return NextResponse.json({ success: false, message: 'Missing required parameters' }, { status: 400 });
  }

  const user = await getUserByKey(key);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid key' }, { status: 404 });
  }

  if (!(await canResetHwid(user))) {
    return NextResponse.json({ success: false, message: 'Cannot reset HWID at this time' }, { status: 403 });
  }

  const allUsers = await getAllUsers();
  const username = Object.keys(allUsers).find(u => allUsers[u].Key === key);
  if (username) {
    allUsers[username].Hwid = newHwid;
    await updateUsers(allUsers);
  }

  return NextResponse.json({ success: true, message: 'HWID reset successfully' });
}
