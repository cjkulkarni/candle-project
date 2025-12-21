import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const cookieHeader = request.headers.get('cookie') || '';
    const nonce = request.headers.get('x-wc-store-api-nonce') || '';

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    console.log('Creating order with data:', JSON.stringify(body, null, 2));

    // Prepare headers for WooCommerce request
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    // Include nonce if available
    if (nonce) {
      headers['Nonce'] = nonce;
    }

    // Include cookies for session management
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Prepare checkout data with addresses included
    const checkoutData = {
      billing_address: {
        first_name: body.billing_address.first_name,
        last_name: body.billing_address.last_name,
        company: '',
        address_1: body.billing_address.address_1,
        address_2: body.billing_address.address_2,
        city: body.billing_address.city,
        state: body.billing_address.state,
        postcode: body.billing_address.postcode,
        country: body.billing_address.country,
        email: body.billing_address.email,
        phone: body.billing_address.phone,
      },
      shipping_address: {
        first_name: body.shipping_address.first_name,
        last_name: body.shipping_address.last_name,
        company: '',
        address_1: body.shipping_address.address_1,
        address_2: body.shipping_address.address_2,
        city: body.shipping_address.city,
        state: body.shipping_address.state,
        postcode: body.shipping_address.postcode,
        country: body.shipping_address.country,
      },
      payment_method: 'cod', // Cash on Delivery (no payment required)
    };

    // Add customer note if provided
    if (body.customer_note) {
      checkoutData.customer_note = body.customer_note;
    }

    console.log('Sending to WooCommerce checkout:', JSON.stringify(checkoutData, null, 2));

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/checkout`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(checkoutData),
      }
    );
console.log('Received response from WooCommerce checkout',response);
    const responseData = await response.json();
    console.log('WooCommerce checkout response:', response.status, JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      // Extract detailed error message
      let errorMessage = 'Failed to create order';

      if (responseData.message) {
        errorMessage = responseData.message;
      } else if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.data && responseData.data.params) {
        errorMessage = `Invalid parameters: ${responseData.data.params.join(', ')}`;
      }

      console.error('Checkout error details:', responseData);

      return NextResponse.json(
        { error: errorMessage, details: responseData },
        { status: response.status }
      );
    }

    // Return order details
    return NextResponse.json({
      success: true,
      order_id: responseData.order_id,
      order_number: responseData.order_number || responseData.order_id,
      status: responseData.status || 'pending',
      order_key: responseData.order_key,
      customer_id: responseData.customer_id,
      ...responseData,
    }, { status: 201 });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
