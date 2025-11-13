/**
 * API Route: GET /api/products
 * Fetches products from WooCommerce
 */

import { getProducts } from '@/lib/backendService';

export async function GET(request) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const perPage = searchParams.get('perPage') || 20;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const orderby = searchParams.get('orderby') || 'date';
    const order = searchParams.get('order') || 'desc';

    const params = {
      page: parseInt(page),
      per_page: parseInt(perPage),
      orderby,
      order,
      ...(search && { search }),
      ...(category && { category }),
    };

    const products = await getProducts(params);

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
    console.error('Error fetching products:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
