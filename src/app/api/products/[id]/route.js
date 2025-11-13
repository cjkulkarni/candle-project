/**
 * API Route: GET /api/products/[id]
 * Fetches a single product by ID from WooCommerce
 */

import { getProductById } from '@/lib/backendService';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        {
          success: false,
          error: 'Product ID is required',
        },
        { status: 400 }
      );
    }

    const product = await getProductById(id);

    return Response.json(
      {
        success: true,
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
