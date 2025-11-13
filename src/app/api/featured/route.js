/**
 * API Route: GET /api/featured
 * Fetches featured products from WooCommerce
 */

import { getFeaturedProducts } from '@/lib/backendService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('perPage') || 12;

    const params = {
      page: parseInt(page),
      per_page: parseInt(perPage),
    };

    const products = await getFeaturedProducts(params);

    return Response.json(
      {
        success: true,
        data: products,
        meta: {
          page: parseInt(page),
          perPage: parseInt(perPage),
          total: products.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
