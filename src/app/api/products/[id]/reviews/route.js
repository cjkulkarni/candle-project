/**
 * API Route: GET /api/products/[id]/reviews
 * Fetches reviews for a specific product from WooCommerce
 */

import { getProductReviews } from '@/lib/backendService';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('perPage') || 10;

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    const reviewParams = {
      page: parseInt(page),
      per_page: parseInt(perPage),
    };

    const reviews = await getProductReviews(id, reviewParams);

    return Response.json(
      {
        success: true,
        data: reviews,
        meta: {
          productId: id,
          page: parseInt(page),
          perPage: parseInt(perPage),
          total: reviews.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch product reviews',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
