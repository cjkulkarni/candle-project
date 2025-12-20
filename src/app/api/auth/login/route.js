import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL ;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Accept either email or username
    const user = email || username;

    if (!user || !password) {
      return NextResponse.json(
        { error: 'Email/Username and password are required' },
        { status: 400 }
      );
    }

    if (!WORDPRESS_API_URL) {
      console.error('WORDPRESS_API_URL is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get JWT token from WordPress
    const tokenResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user,
          password,
        }),
      }
    );
 
    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('JWT authentication error:', error);

      if (tokenResponse.status === 404) {
        return NextResponse.json(
          { error: 'JWT Auth endpoint not found. Check WordPress setup.' },
          { status: 404 }
        );
      }

      // Extract error message from WordPress response (may be nested in details)
      let errorMessage = error.message || error.error || 'Login failed';

      // Check for nested error structure
      if (error.details && error.details.message) {
        errorMessage = error.details.message;
      }

      // Strip HTML tags from the error message
      errorMessage = errorMessage.replace(/<[^>]*>/g, '').trim();

      // Check error code for specific messages
      const errorCode = error.code || (error.details && error.details.code) || '';

      if (errorCode.includes('invalid_username')) {
        return NextResponse.json(
          { error: 'Email/Username not found. Please check or register.' },
          { status: 401 }
        );
      } else if (errorCode.includes('incorrect_password')) {
        return NextResponse.json(
          { error: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: errorMessage },
          { status: tokenResponse.status }
        );
      }
    }

    const tokenData = await tokenResponse.json();

    // Get authenticated user data using /me endpoint
    const meResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/custom/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );

    if (!meResponse.ok) {
      console.error('Failed to fetch user from /me endpoint');
      return NextResponse.json(
        {
          token: tokenData.token,
          user: {
            id: 0,
            email: tokenData.user_email || '',
            firstName: '',
            lastName: '',
            username: tokenData.user_nicename || '',
            phone: '',
            roles: [],
            billing: {
              firstName: '',
              lastName: '',
              company: '',
              address1: '',
              address2: '',
              city: '',
              postcode: '',
              country: '',
              state: '',
              email: '',
              phone: ''
            },
            shipping: {
              firstName: '',
              lastName: '',
              company: '',
              address1: '',
              address2: '',
              city: '',
              postcode: '',
              country: '',
              state: '',
              phone: ''
            },
            avatar: `https://ui-avatars.com/api/?name=User&background=random`,
          },
        },
        { status: 200 }
      );
    }

    const userData = await meResponse.json();

    return NextResponse.json(
      {
        token: tokenData.token,
        user: {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          phone: userData.phone || '',
          roles: userData.roles || [],
          // Billing Address
          billing: {
            firstName: userData.billing?.first_name || '',
            lastName: userData.billing?.last_name || '',
            company: userData.billing?.company || '',
            address1: userData.billing?.address_1 || '',
            address2: userData.billing?.address_2 || '',
            city: userData.billing?.city || '',
            postcode: userData.billing?.postcode || '',
            country: userData.billing?.country || '',
            state: userData.billing?.state || '',
            email: userData.billing?.email || userData.email,
            phone: userData.billing?.phone || userData.phone || ''
          },
          // Shipping Address
          shipping: {
            firstName: userData.shipping?.first_name || '',
            lastName: userData.shipping?.last_name || '',
            company: userData.shipping?.company || '',
            address1: userData.shipping?.address_1 || '',
            address2: userData.shipping?.address_2 || '',
            city: userData.shipping?.city || '',
            postcode: userData.shipping?.postcode || '',
            country: userData.shipping?.country || '',
            state: userData.shipping?.state || '',
            phone: userData.shipping?.phone || userData.phone || ''
          },
          avatar: userData.avatars || 
            `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
