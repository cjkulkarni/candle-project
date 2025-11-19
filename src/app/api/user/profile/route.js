import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

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
      `${WORDPRESS_API_URL}/wp-json/custom/v1/me`,
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

    const userData = await meResponse.json();

    return NextResponse.json(
      {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        phone: userData.phone || '',
        roles: userData.roles || [],
        billing: {
          first_name: userData.billing?.first_name || '',
          last_name: userData.billing?.last_name || '',
          company: userData.billing?.company || '',
          address_1: userData.billing?.address_1 || '',
          address_2: userData.billing?.address_2 || '',
          city: userData.billing?.city || '',
          postcode: userData.billing?.postcode || '',
          country: userData.billing?.country || '',
          state: userData.billing?.state || '',
          email: userData.billing?.email || userData.email,
          phone: userData.billing?.phone || userData.phone || ''
        },
        shipping: {
          first_name: userData.shipping?.first_name || '',
          last_name: userData.shipping?.last_name || '',
          company: userData.shipping?.company || '',
          address_1: userData.shipping?.address_1 || '',
          address_2: userData.shipping?.address_2 || '',
          city: userData.shipping?.city || '',
          postcode: userData.shipping?.postcode || '',
          country: userData.shipping?.country || '',
          state: userData.shipping?.state || '',
          phone: userData.shipping?.phone || userData.phone || ''
        },
        avatar: userData.avatars || 
          `https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`,
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
    const {
      firstName,
      lastName,
      phone,
      billing,
      shipping,
    } = body;

    // Get current user ID using /me endpoint
    const meResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/custom/v1/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
console.log("meResponse:", meResponse);
    if (!meResponse.ok) {
      console.error('Failed to fetch user from /me endpoint');
      return NextResponse.json(
        { error: 'Failed to authenticate user' },
        { status: meResponse.status }
      );
    }

    const meData = await meResponse.json();

    // Prepare update payload in the same format as API response
    // Convert from camelCase (from frontend) back to underscore format (for API)
    const updateBody = {
      first_name: firstName || meData.first_name,
      last_name: lastName || meData.last_name,
      phone: phone || meData.phone,
      billing: {
        first_name: billing?.first_name || meData.billing?.first_name || '',
        last_name: billing?.last_name || meData.billing?.last_name || '',
        company: billing?.company || meData.billing?.company || '',
        address_1: billing?.address_1 || meData.billing?.address_1 || '',
        address_2: billing?.address_2 || meData.billing?.address_2 || '',
        city: billing?.city || meData.billing?.city || '',
        postcode: billing?.postcode || meData.billing?.postcode || '',
        country: billing?.country || meData.billing?.country || '',
        state: billing?.state || meData.billing?.state || '',
        email: billing?.email || meData.billing?.email || meData.email || '',
        phone: billing?.phone || meData.billing?.phone || phone || meData.phone || ''
      },
      shipping: {
        first_name: shipping?.first_name || meData.shipping?.first_name || '',
        last_name: shipping?.last_name || meData.shipping?.last_name || '',
        company: shipping?.company || meData.shipping?.company || '',
        address_1: shipping?.address_1 || meData.shipping?.address_1 || '',
        address_2: shipping?.address_2 || meData.shipping?.address_2 || '',
        city: shipping?.city || meData.shipping?.city || '',
        postcode: shipping?.postcode || meData.shipping?.postcode || '',
        country: shipping?.country || meData.shipping?.country || '',
        state: shipping?.state || meData.shipping?.state || '',
        phone: shipping?.phone || meData.shipping?.phone || phone || meData.phone || ''
      }
    };

    // Update user profile using custom update endpoint with PUT method
    const updateResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/custom/v1/update`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      }
    );

    if (!updateResponse.ok) {
      console.error('Failed to update user profile');
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: updateResponse.status }
      );
    }

    const updatedUserData = await updateResponse.json();
    const updatedData = updatedUserData.user; // Adjusted to use the correct variable
    return NextResponse.json(
      {
        id: updatedData.id,
        email: updatedData.email,
        username: updatedData.username,
        firstName: updatedData.first_name || '',
        lastName: updatedData.last_name || '',
        phone: updatedData.phone || '',
        roles: updatedData.roles || [],
        billing: {
          first_name: updatedData.billing?.first_name || '',
          last_name: updatedData.billing?.last_name || '',
          company: updatedData.billing?.company || '',
          address_1: updatedData.billing?.address_1 || '',
          address_2: updatedData.billing?.address_2 || '',
          city: updatedData.billing?.city || '',
          postcode: updatedData.billing?.postcode || '',
          country: updatedData.billing?.country || '',
          state: updatedData.billing?.state || '',
          email: updatedData.billing?.email || updatedData.email,
          phone: updatedData.billing?.phone || updatedData.phone || ''
        },
        shipping: {
          first_name: updatedData.shipping?.first_name || '',
          last_name: updatedData.shipping?.last_name || '',
          company: updatedData.shipping?.company || '',
          address_1: updatedData.shipping?.address_1 || '',
          address_2: updatedData.shipping?.address_2 || '',
          city: updatedData.shipping?.city || '',
          postcode: updatedData.shipping?.postcode || '',
          country: updatedData.shipping?.country || '',
          state: updatedData.shipping?.state || '',
          phone: updatedData.shipping?.phone || updatedData.phone || ''
        },
        avatar: updatedData.avatars || 
          `https://ui-avatars.com/api/?name=${updatedData.first_name}+${updatedData.last_name}&background=random`,
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
