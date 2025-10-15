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
