import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    // Fetch customer orders using custom WordPress endpoint
    // This endpoint needs to be registered in WordPress (see below for PHP code)
    const ordersResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/v1/orders`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
console.log('Orders response status:', ordersResponse );
    if (!ordersResponse.ok) {
      const errorData = await ordersResponse.json().catch(() => ({}));
      console.error('Orders fetch error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch orders' },
        { status: ordersResponse.status }
      );
    }

    const orders = await ordersResponse.json();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
