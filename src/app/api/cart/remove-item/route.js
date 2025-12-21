import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Cart item key is required' },
        { status: 400 }
      );
    }

    const cookieHeader = request.headers.get('cookie') || '';
    const nonce = request.headers.get('x-wc-store-api-nonce') || '';

    const headers = {
      'Content-Type': 'application/json',
    };

    if (nonce) {
      headers['Nonce'] = nonce;
    }

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart/remove-item`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ key }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || responseData.error || 'Failed to remove item from cart' },
        { status: response.status }
      );
    }

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
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
