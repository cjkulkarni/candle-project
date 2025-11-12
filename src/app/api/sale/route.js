/**
 * API Route: GET /api/sale
 * Fetches products on sale from WooCommerce
 */

import { getOnSaleProducts } from '@/lib/backendService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('perPage') || 12;

    const params = {
      page: parseInt(page),
      per_page: parseInt(perPage),
    };

    const products = await getOnSaleProducts(params);

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
    console.error('Error fetching sale products:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch sale products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
