/**
 * API Route: GET /api/categories
 * Fetches product categories from WooCommerce
 */

import { getCategories } from '@/lib/backendService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get('perPage') || 100;
    const search = searchParams.get('search');

    const params = {
      per_page: parseInt(perPage),
      ...(search && { search }),
    };

    const categories = await getCategories(params);

    return Response.json(
      {
        success: true,
        data: categories,
        meta: {
          total: categories.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
