// app/lib/edge-config.ts (updated)
// Note: Renamed from edge-config.ts and moved to lib for convention

import { get } from '@vercel/edge-config';

export interface User {
  UserID: string;
  username: string;
  Hwid: string;
  Key: string;
  createdAt: string;
  time: string;
  lastHwidReset?: string;
}

export interface UsersData {
  [username: string]: User;
}

// Get all users from Edge Config
export async function getAllUsers(): Promise<UsersData> {
  try {
    const users = await get<UsersData>('users');
    return users || {};
  } catch (error) {
    console.error('Error fetching users:', error);
    return {};
  }
}

// Update all users in Edge Config
export async function updateUsers(users: UsersData): Promise<void> {
  const edgeConfigId = process.env.EDGE_CONFIG_ID;
  const token = process.env.VERCEL_API_TOKEN;

  if (!edgeConfigId || !token) {
    throw new Error('Missing environment variables for Edge Config update');
  }

  const response = await fetch(`https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          operation: 'upsert',
          key: 'users',
          value: users,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Edge Config: ${error}`);
  }
}

// Find user by key
export async function getUserByKey(key: string): Promise<{ username: string; user: User } | null> {
  try {
    const users = await getAllUsers();
    
    for (const [username, user] of Object.entries(users)) {
      if (user.Key === key) {
        return { username, user };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding user by key:', error);
    return null;
  }
}

// Find user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const users = await getAllUsers();
    return users[username] || null;
  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
}

// Check if key has expired
export function isKeyExpired(createdAt: string, time: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  
  // Parse time format (e.g., "30d", "7d", "365d")
  const timeMatch = time.match(/^(\d+)([dDhHmM])$/);
  if (!timeMatch) return true;
  
  const amount = parseInt(timeMatch[1]);
  const unit = timeMatch[2].toLowerCase();
  
  let expirationDate = new Date(created);
  
  switch (unit) {
    case 'd':
      expirationDate.setDate(expirationDate.getDate() + amount);
      break;
    case 'h':
      expirationDate.setHours(expirationDate.getHours() + amount);
      break;
    case 'm':
      expirationDate.setMonth(expirationDate.getMonth() + amount);
      break;
    default:
      return true;
  }
  
  return now > expirationDate;
}

// Check if HWID reset is allowed (24 hour cooldown)
export function canResetHwid(lastReset?: string): boolean {
  if (!lastReset) return true;
  
  const lastResetDate = new Date(lastReset);
  const now = new Date();
  const hoursSinceReset = (now.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceReset >= 24;
}

// Generate random key in format XXX-XXX-XXX
export function generateKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const generateSegment = () => {
    let segment = '';
    for (let i = 0; i < 3; i++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return segment;
  };
  
  return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

// Generate unique user ID
export async function generateUserId(): Promise<string> {
  const users = await getAllUsers();
  let userId: string;
  
  do {
    userId = Math.floor(1000000 + Math.random() * 9000000).toString();
  } while (Object.values(users).some(u => u.UserID === userId));
  
  return userId;
}
