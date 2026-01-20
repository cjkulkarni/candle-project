import { NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
const WC_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

// Helper function to create Basic Auth header
function createBasicAuth(key, secret) {
  const credentials = `${key}:${secret}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      email,
      firstName,
      lastName,
      phone,
      password,
      address,
      city,
      zipCode,
      country,
      recaptchaToken,
    } = body;
    const username = email;
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'register');
    if (!recaptchaResult.success && !recaptchaResult.skipped) {
      console.error('reCAPTCHA verification failed:', recaptchaResult.error);
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check if API credentials are available
    if (!WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
      console.error('WooCommerce API credentials not configured');
      return NextResponse.json(
        { error: 'Server configuration error. API credentials not set.' },
        { status: 500 }
      );
    }

    // Register customer in WooCommerce with API authentication
    const registerResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/v3/customers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': createBasicAuth(WC_CONSUMER_KEY, WC_CONSUMER_SECRET),
        },
        body: JSON.stringify({
          email,
          username: email,
          password,
          first_name: firstName,
          last_name: lastName,
          billing: {
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || '',
            address_1: address || '',
            city: city || '',
            postcode: zipCode || '',
            country: country || '',
          },
          shipping: {
            first_name: firstName,
            last_name: lastName,
            address_1: address || '',
            city: city || '',
            postcode: zipCode || '',
            country: country || '',
          },
        }),
      }
    );

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      console.error('WooCommerce registration error:', error);
      return NextResponse.json(
        {
          error: error.message || 'Registration failed',
          details: error.data || null,
        },
        { status: registerResponse.status }
      );
    }

    const newUser = await registerResponse.json();


    // Now login the user to get JWT token
    const loginResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      }
    );

    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('JWT login error:', error);
      return NextResponse.json(
        { error: 'Registration successful but login failed. Please try logging in manually.' },
        { status: 400 }
      );
    }

    const loginData = await loginResponse.json();

    // Get user details from WordPress
    const userResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/users/${loginData.user_id}`,
      {
        headers: {
          Authorization: `Bearer ${loginData.token}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch user details');
      return NextResponse.json(
        {
          token: loginData.token,
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.first_name,
            lastName: newUser.last_name,
            avatar: `https://ui-avatars.com/api/?name=${newUser.first_name}+${newUser.last_name}&background=random`,
          },
        },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();

    return NextResponse.json(
      {
        token: loginData.token,
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          phone: userData.acf?.phone || phone || '',
          address: userData.acf?.address || address || '',
          city: userData.acf?.city || city || '',
          zipCode: userData.acf?.zip_code || zipCode || '',
          country: userData.acf?.country || country || '',
          avatar: userData.avatar_urls?.['96'] ||
            `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`,
          username: userData.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
