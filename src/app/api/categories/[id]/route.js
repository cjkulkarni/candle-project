/**
 * API Route: GET /api/categories/[id]
 * Fetches a single category by ID from WooCommerce
 */

import { getCategoryById } from '@/lib/backendService';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Category ID is required',
        },
        { status: 400 }
      );
    }

    const category = await getCategoryById(id);

    return Response.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching category:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch category',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
