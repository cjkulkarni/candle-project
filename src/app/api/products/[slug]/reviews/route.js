import { NextResponse } from 'next/server';

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Helper function to get product ID from slug
async function getProductIdBySlug(slug) {
  try {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/store/v1/products?slug=${slug}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const products = await response.json();

    if (Array.isArray(products) && products.length > 0) {
      return products[0].id;
    }

    return null;
  } catch (error) {
    console.error('Error getting product ID:', error);
    return null;
  }
}

// GET - Fetch product reviews
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    // Get product ID from slug
    const productId = await getProductIdBySlug(slug);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Build auth credentials for WooCommerce API
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    // Get query parameters for pagination/filtering
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('per_page') || '10';
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';

    const reviewsResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/v3/products/reviews?product=${productId}&page=${page}&per_page=${perPage}&orderby=${orderby}&order=${order}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!reviewsResponse.ok) {
      const errorData = await reviewsResponse.json().catch(() => ({}));
      console.error('Reviews fetch error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch reviews' },
        { status: reviewsResponse.status }
      );
    }

    const reviews = await reviewsResponse.json();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Submit a new review
export async function POST(request, { params }) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // Get product ID from slug
    const productId = await getProductIdBySlug(slug);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const { rating, review, reviewer, reviewer_email } = body;

    // Validate required fields
    if (!rating || rating < 0 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 0 and 5' },
        { status: 400 }
      );
    }

    if (!review || review.trim().length === 0) {
      return NextResponse.json(
        { error: 'Review text is required' },
        { status: 400 }
      );
    }

    if (!reviewer || reviewer.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reviewer name is required' },
        { status: 400 }
      );
    }

    if (!reviewer_email || reviewer_email.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reviewer email is required' },
        { status: 400 }
      );
    }

    // Build auth credentials for WooCommerce API
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const reviewResponse = await fetch(
      `${WORDPRESS_API_URL}/wp-json/wc/v3/products/reviews`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          review,
          reviewer,
          reviewer_email,
          rating,
          status: 'approved', // Auto-approve reviews, change to 'hold' for moderation
        }),
      }
    );

    if (!reviewResponse.ok) {
      const errorData = await reviewResponse.json().catch(() => ({}));
      console.error('Review submission error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to submit review' },
        { status: reviewResponse.status }
      );
    }

    const result = await reviewResponse.json();

    // Trigger product cache refresh by fetching the updated product
    // This ensures the average rating is recalculated
    try {
      await fetch(
        `${WORDPRESS_API_URL}/wp-json/wc/v3/products/${productId}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
        }
      );
    } catch (cacheError) {
      console.error('Cache refresh error:', cacheError);
      // Non-critical, continue anyway
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
