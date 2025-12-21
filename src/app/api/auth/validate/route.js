import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL ;

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Validate token with WordPress JWT
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token/validate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Token validation failed');
      return NextResponse.json(
        { valid: false },
        { status: 200 }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      { 
        valid: data.code === 'jwt_auth_valid_token',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token validation endpoint error:', error);
    return NextResponse.json(
      { valid: false, error: 'Token validation failed' },
      { status: 500 }
    );
  }
}
