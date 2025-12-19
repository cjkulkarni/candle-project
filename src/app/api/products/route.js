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
    const perPage = searchParams.get('perPage') || process.env.PRODUCTS_PER_PAGE || 12;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'date';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Map sortBy to WooCommerce orderby and order
    let orderby = 'date';
    let order = 'desc';

    switch (sortBy) {
      case 'price-low':
        orderby = 'price';
        order = 'asc';
        break;
      case 'price-high':
        orderby = 'price';
        order = 'desc';
        break;
      case 'name':
        orderby = 'title';
        order = 'asc';
        break;
      case 'featured':
      default:
        orderby = 'date';
        order = 'desc';
        break;
    }

    const params = {
      page: parseInt(page),
      per_page: parseInt(perPage),
      orderby,
      order,
      ...(search && { search }),
      ...(category && category !== 'All' && { category }),
      ...(minPrice && { min_price: minPrice }),
      ...(maxPrice && { max_price: maxPrice }),
    };

    const result = await getProducts(params);
    const products = result.data;
    const totalCount = parseInt(result.headers.total) || products.length;
    const totalPages = parseInt(result.headers.totalPages) || Math.ceil(totalCount / parseInt(perPage));

    return Response.json(
      {
        success: true,
        data: products,
        meta: {
          page: parseInt(page),
          perPage: parseInt(perPage),
          total: totalCount,
          totalPages: totalPages,
          hasMore: parseInt(page) < totalPages,
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
