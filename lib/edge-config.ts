import { get } from '@vercel/edge-config';

export interface WhitelistUser {
  email: string;
  username: string;
  createdAt: string;
  role?: string;
}

export async function isWhitelisted(email: string): Promise<boolean> {
  try {
    const whitelist = await get<string[]>('whitelist');
    return whitelist ? whitelist.includes(email.toLowerCase()) : false;
  } catch (error) {
    console.error('Error checking whitelist:', error);
    return false;
  }
}

export async function getWhitelistedUsers(): Promise<WhitelistUser[]> {
  try {
    const users = await get<WhitelistUser[]>('users');
    return users || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<WhitelistUser | null> {
  try {
    const users = await getWhitelistedUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}
