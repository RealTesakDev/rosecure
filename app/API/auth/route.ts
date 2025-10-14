import { NextRequest, NextResponse } from 'next/server';
import { isWhitelisted, getUserByEmail } from '@/lib/edge-config';

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json();

    if (!email || !action) {
      return NextResponse.json(
        { error: 'Email and action are required' },
        { status: 400 }
      );
    }

    const whitelisted = await isWhitelisted(email);

    if (action === 'login') {
      if (!whitelisted) {
        return NextResponse.json(
          { error: 'Email not whitelisted' },
          { status: 403 }
        );
      }

      const user = await getUserByEmail(email);
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user,
        message: 'Login successful'
      });
    }

    if (action === 'signup') {
      if (!whitelisted) {
        return NextResponse.json(
          { error: 'Email not whitelisted. Please contact an administrator.' },
          { status: 403 }
        );
      }

      const existingUser = await getUserByEmail(email);
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Email is whitelisted. You can complete signup.',
        canSignup: true
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
