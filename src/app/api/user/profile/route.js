import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL ;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Get authenticated user data using /me endpoint
    const meResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!meResponse.ok) {
      console.error('Failed to fetch user from /me endpoint');
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: meResponse.status }
      );
    }

    const meData = await meResponse.json();

    // Get full user details from WordPress /wp/v2/users endpoint
    const userResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/users/${meData.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch full user profile');
      // Return basic info from /me endpoint
      return NextResponse.json(
        {
          id: meData.id,
          email: meData.email || '',
          firstName: meData.first_name || '',
          lastName: meData.last_name || '',
          username: meData.username || '',
          avatar: `https://ui-avatars.com/api/?name=${meData.first_name || 'User'}&background=random`,
        },
        { status: 200 }
      );
    }

    const userData = await userResponse.json();

    return NextResponse.json(
      {
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user profile endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, address, city, zipCode, country } = body;

    // Get authenticated user ID using /me endpoint
    const meResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/jwt-auth/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!meResponse.ok) {
      console.error('Failed to fetch user from /me endpoint');
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: meResponse.status }
      );
    }

    const meData = await meResponse.json();
    const userId = meData.id;

    // Update user profile on WordPress
    const updateResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wp/v2/users/${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          meta: {
            phone: phone || '',
            address: address || '',
            city: city || '',
            zip_code: zipCode || '',
            country: country || '',
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      console.error('Failed to update user profile');
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: updateResponse.status }
      );
    }

    const userData = await updateResponse.json();

    return NextResponse.json(
      {
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Update user profile endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
