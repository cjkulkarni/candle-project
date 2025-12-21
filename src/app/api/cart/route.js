import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function GET(request) {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart`, {
      headers: {
        'Nonce': request.headers.get('Nonce') || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cart fetch error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch cart' },
        { status: response.status }
      );
    }

    const cart = await response.json();

    // Extract nonce from response headers if available
    const nonce = response.headers.get('Nonce') || response.headers.get('X-WC-Store-API-Nonce');

    return NextResponse.json(cart, {
      headers: nonce ? { 'X-WC-Store-API-Nonce': nonce } : {},
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
