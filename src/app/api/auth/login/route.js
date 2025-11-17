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

      // Return user-friendly error messages
      if (error.code === 'invalid_username') {
        return NextResponse.json(
          { error: 'Email/Username not found. Please check or register.' },
          { status: 401 }
        );
      } else if (error.code === 'incorrect_password') {
        return NextResponse.json(
          { error: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      } else {
        return NextResponse.json(
          { error: error.message || 'Login failed' },
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
    console.log( meResponse);

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
            avatar: `https://ui-avatars.com/api/?name=User&background=random`,
          },
        },
        { status: 200 }
      );
    }

    const meData = await meResponse.json();

    // Get full user details from WordPress /wp/v2/users endpoint
    const userResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/users/${meData.id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch user details from /wp/v2/users');
      return NextResponse.json(
        {
          token: tokenData.token,
          user: {
            id: meData.id,
            email: meData.email || tokenData.user_email || '',
            firstName: meData.first_name || '',
            lastName: meData.last_name || '',
            username: meData.username || tokenData.user_nicename || '',
            avatar: `https://ui-avatars.com/api/?name=${meData.first_name || 'User'}&background=random`,
          },
        },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();
    
    return NextResponse.json(
      {
        token: tokenData.token,
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          phone: userData.acf?.phone || '',
          address: userData.acf?.address || '',
          city: userData.acf?.city || '',
          zipCode: userData.acf?.zip_code || '',
          country: userData.acf?.country || '',
          avatar: userData.avatar_urls?.['96'] || 
            `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`,
          username: userData.username,
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
