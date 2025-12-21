import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function GET(request) {
  try {
    // Make a request to get the cart, which will return a nonce
    const cookieHeader = request.headers.get('cookie') || '';

    const headers = {
      'Content-Type': 'application/json',
    };

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/cart`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Nonce fetch error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch nonce' },
        { status: response.status }
      );
    }

    const cart = await response.json();

    // Extract nonce from response headers
    const nonce = response.headers.get('nonce') || response.headers.get('x-wc-store-api-nonce') || '';
    const setCookies = response.headers.get('set-cookie');

    console.log('Nonce retrieved:', nonce);

    const responseHeaders = {
      'X-WC-Store-API-Nonce': nonce,
    };

    if (setCookies) {
      responseHeaders['Set-Cookie'] = setCookies;
    }

    return NextResponse.json(
      { nonce, cart },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error('Get nonce error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
