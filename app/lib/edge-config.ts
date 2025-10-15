// app/lib/edge-config.ts
import { createClient } from '@vercel/edge-config';

export interface User {
  UserID: string | number;
  username: string;
  Hwid: string;
  Key: string;
  createdAt: string;
  time: string;
}

const client = createClient(process.env.EDGE_CONFIG);

// Existing functions
export async function getUserByUsername(username: string): Promise<User | undefined> {
  const users = await client.get('users');
  return users ? users[username] : undefined;
}

export async function generateUserId(): Promise<string> {
  // Implement logic to generate a unique ID
  return `user_${Date.now()}`;
}

export function generateKey(): string {
  // Implement key generation logic
  return `key_${Math.random().toString(36).substr(2, 9)}`;
}

export async function getAllUsers(): Promise<Record<string, User>> {
  const users = await client.get('users');
  return users || {};
}

export async function updateUsers(users: Record<string, User>): Promise<void> {
  await client.set('users', users);
}

// New functions to resolve the errors
export async function getUserByKey(key: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return Object.values(users).find(user => user.Key === key);
}

export async function canResetHwid(user: User): Promise<boolean> {
  // Implement logic to determine if HWID can be reset (e.g., based on time or rules)
  // Placeholder: Allow reset if time is within a certain range (e.g., last 24 hours)
  const lastReset = user.createdAt || '';
  const now = new Date().toISOString().split('T')[0];
  return !lastReset || (new Date(now).getTime() - new Date(lastReset).getTime()) > 24 * 60 * 60 * 1000;
}

export function isKeyExpired(key: string, expirationDays: number = 30): boolean {
  // Implement logic to check if a key is expired (e.g., based on creation date)
  // Placeholder: Assume key creation date is tracked in User.createdAt
  const users = Object.values(await getAllUsers());
  const user = users.find(u => u.Key === key);
  if (!user || !user.createdAt) return true;
  const created = new Date(user.createdAt).getTime();
  const now = new Date().getTime();
  return (now - created) > expirationDays * 24 * 60 * 60 * 1000;
}
