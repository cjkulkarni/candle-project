import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function GET(request) {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch cart' },
        { status: response.status }
      );
    }

    const cart = await response.json();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
