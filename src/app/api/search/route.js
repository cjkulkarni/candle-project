/**
 * API Route: GET /api/search
 * Searches products in WooCommerce
 */

import { searchProducts } from '@/lib/backendService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('perPage') || 20;

    if (!query || query.trim() === '') {
      return Response.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const params = {
      page: parseInt(page),
      per_page: parseInt(perPage),
    };

    const results = await searchProducts(query.trim(), params);

    return Response.json(
      {
        success: true,
        data: results,
        query: query.trim(),
        meta: {
          page: parseInt(page),
          perPage: parseInt(perPage),
          total: results.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to search products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
