import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, quantity } = body;

    if (!id || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart/add-item`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, quantity }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to add item to cart' },
        { status: response.status }
      );
    }

    const cart = await response.json();
    return NextResponse.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
