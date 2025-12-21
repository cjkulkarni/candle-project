<?php
/**
 * Custom WordPress REST API Endpoint for Customer Orders
 *
 * Add this code to your WordPress theme's functions.php file
 * or create a custom plugin with this code.
 *
 * This endpoint allows authenticated users to fetch their own orders
 * using JWT authentication.
 */

// Register custom REST API endpoint for customer orders
add_action('rest_api_init', function () {
    // Test endpoint to verify the custom API is working
    register_rest_route('custom/v1', '/test', array(
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response(array(
                'status' => 'success',
                'message' => 'Custom API endpoint is working!'
            ));
        },
        'permission_callback' => '__return_true',
    ));

    // Customer orders endpoint
    register_rest_route('custom/v1', '/customer-orders', array(
        'methods' => 'GET',
        'callback' => 'get_customer_orders',
        'permission_callback' => 'verify_jwt_token',
    ));
});

/**
 * Verify JWT token and return user ID
 */
function verify_jwt_token($request) {
    // Get the Authorization header
    $auth_header = $request->get_header('Authorization');

    if (!$auth_header) {
        return new WP_Error(
            'jwt_auth_no_auth_header',
            'Authorization header not found.',
            array('status' => 401)
        );
    }

    // Extract the token
    list($token) = sscanf($auth_header, 'Bearer %s');

    if (!$token) {
        return new WP_Error(
            'jwt_auth_bad_auth_header',
            'Authorization header malformed.',
            array('status' => 401)
        );
    }

    // Validate the token using WordPress JWT Auth plugin
    // Use the built-in validation endpoint
    $validation_request = new WP_REST_Request('POST', '/jwt-auth/v1/token/validate');
    $validation_request->set_header('Authorization', $auth_header);

    $validation_response = rest_do_request($validation_request);

    if (is_wp_error($validation_response)) {
        return new WP_Error(
            'jwt_auth_invalid_token',
            'Token validation failed.',
            array('status' => 401)
        );
    }

    $validation_data = $validation_response->get_data();

    if (!isset($validation_data['data']['user_id'])) {
        return new WP_Error(
            'jwt_auth_invalid_token',
            'Invalid token - user ID not found.',
            array('status' => 401)
        );
    }

    // Store user ID for use in callback
    $request->set_param('user_id', $validation_data['data']['user_id']);

    return true;
}

/**
 * Get customer orders callback
 */
function get_customer_orders($request) {
    // Get user ID from JWT token validation
    $user_id = $request->get_param('user_id');

    if (!$user_id) {
        return new WP_Error(
            'invalid_user',
            'Could not determine user ID.',
            array('status' => 401)
        );
    }

    // Get all orders for this customer
    $orders = wc_get_orders(array(
        'customer_id' => $user_id,
        'limit' => 100,
        'orderby' => 'date',
        'order' => 'DESC',
    ));

    $formatted_orders = array();

    foreach ($orders as $order) {
        $order_data = array(
            'id' => $order->get_id(),
            'number' => $order->get_order_number(),
            'status' => $order->get_status(),
            'date_created' => $order->get_date_created()->date('c'),
            'total' => $order->get_total(),
            'currency' => $order->get_currency(),
            'currency_symbol' => get_woocommerce_currency_symbol($order->get_currency()),
            'customer_id' => $order->get_customer_id(),
            'billing' => array(
                'first_name' => $order->get_billing_first_name(),
                'last_name' => $order->get_billing_last_name(),
                'email' => $order->get_billing_email(),
                'phone' => $order->get_billing_phone(),
                'address_1' => $order->get_billing_address_1(),
                'address_2' => $order->get_billing_address_2(),
                'city' => $order->get_billing_city(),
                'state' => $order->get_billing_state(),
                'postcode' => $order->get_billing_postcode(),
                'country' => $order->get_billing_country(),
            ),
            'shipping' => array(
                'first_name' => $order->get_shipping_first_name(),
                'last_name' => $order->get_shipping_last_name(),
                'address_1' => $order->get_shipping_address_1(),
                'address_2' => $order->get_shipping_address_2(),
                'city' => $order->get_shipping_city(),
                'state' => $order->get_shipping_state(),
                'postcode' => $order->get_shipping_postcode(),
                'country' => $order->get_shipping_country(),
            ),
            'line_items' => array(),
        );

        // Get line items
        foreach ($order->get_items() as $item_id => $item) {
            $product = $item->get_product();
            $image_id = $product ? $product->get_image_id() : 0;
            $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : '';

            $order_data['line_items'][] = array(
                'id' => $item->get_product_id(),
                'name' => $item->get_name(),
                'quantity' => $item->get_quantity(),
                'total' => $item->get_total(),
                'subtotal' => $item->get_subtotal(),
                'image' => array(
                    'src' => $image_url,
                ),
            );
        }

        $formatted_orders[] = $order_data;
    }

    return rest_ensure_response($formatted_orders);
}

/**
 * Include JWT library if not already loaded
 * Make sure you have the JWT Auth plugin installed and activated
 * Plugin: https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/
 */
if (!class_exists('JWT')) {
    // If JWT class is not available, you need to install JWT Auth plugin
    // Or include the Firebase JWT library manually
}
