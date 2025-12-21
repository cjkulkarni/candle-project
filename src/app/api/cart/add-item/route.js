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

    console.log('Adding item to cart:', { id, quantity });

    // Forward all cookies from the client request to WordPress
    const cookieHeader = request.headers.get('cookie') || '';
    const nonce = request.headers.get('x-wc-store-api-nonce') || '';

    const headers = {
      'Content-Type': 'application/json',
    };

    // Include nonce if available
    if (nonce) {
      headers['Nonce'] = nonce;
    }

    // Include cookies for session management
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart/add-item`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ id, quantity }),
      }
    );

    const responseData = await response.json();
    console.log('Add to cart response:', response.status, responseData);

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || responseData.error || 'Failed to add item to cart' },
        { status: response.status }
      );
    }

    // Extract nonce and cookies from WooCommerce response
    const newNonce = response.headers.get('nonce') || response.headers.get('x-wc-store-api-nonce');
    const setCookies = response.headers.get('set-cookie');

    const responseHeaders = {};
    if (newNonce) {
      responseHeaders['X-WC-Store-API-Nonce'] = newNonce;
    }
    if (setCookies) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return NextResponse.json(responseData, { headers: responseHeaders });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
