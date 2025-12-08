/**
 * Backend Service - Fetches data from WordPress WooCommerce API
 * Server-side only utility for fetching data from the backend
 */

const BACKEND_URL = process.env.WORDPRESS_API_URL || 'http://localhost/candle/';

/**
 * Make a request to the WordPress REST API
 * @param {string} endpoint - API endpoint (e.g., '/wp-json/wc/v3/products')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {string} token - JWT token
 * @returns {Promise<object>} - Response data
 */

async function fetchFromBackend(endpoint, options, token = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  console.log(url);
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`Backend API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Fetch all products from WooCommerce
 * @param {object} params - Query parameters (page, per_page, search, etc.)
 * @returns {Promise<array>} - Array of products
 */
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.per_page || 20,
    page: params.page || 1,
    orderby: params.orderby || 'date',
    order: params.order || 'desc',
    ...(params.search && { search: params.search }),
    ...(params.category && { category: params.category }),
  });

  return fetchFromBackend(`/wp-json/wc/store/v1/products?${queryParams}`);
}

/**
 * Fetch a single product by ID
 * @param {string|number} productId - Product ID
 * @returns {Promise<object>} - Product data
 */
export async function getProductById(productId) {
  return fetchFromBackend(`/wp-json/wc/store/v1/products/${productId}`);
}

/**
 * Search products
 * @param {string} searchTerm - Search term
 * @param {object} params - Additional query parameters
 * @returns {Promise<array>} - Array of matching products
 */
export async function searchProducts(searchTerm, params = {}) {
  return getProducts({
    search: searchTerm,
    ...params,
  });
}

/**
 * Fetch all product categories
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of categories
 */
export async function getCategories(params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.per_page || 100,
    hide_empty: params.hide_empty || true,
    ...(params.search && { search: params.search }),
  });

  return fetchFromBackend(`/wp-json/wc/v3/products/categories?${queryParams}`);
}

/**
 * Fetch a category by ID
 * @param {string|number} categoryId - Category ID
 * @returns {Promise<object>} - Category data
 */
export async function getCategoryById(categoryId) {
  return fetchFromBackend(`/wp-json/wc/v3/products/categories/${categoryId}`);
}

/**
 * Fetch products by category
 * @param {string|number} categoryId - Category ID
 * @param {object} params - Additional query parameters
 * @returns {Promise<array>} - Array of products in category
 */
export async function getProductsByCategory(categoryId, params = {}) {
  return getProducts({
    category: categoryId,
    ...params,
  });
}

/**
 * Fetch all tags
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of tags
 */
export async function getTags(params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.per_page || 100,
    hide_empty: params.hide_empty || true,
  });

  return fetchFromBackend(`/wp-json/wc/v3/products/tags?${queryParams}`);
}

/**
 * Fetch products on sale
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of products on sale
 */
export async function getOnSaleProducts(params = {}) {
  return getProducts({
    on_sale: true,
    ...params,
  });
}

/**
 * Fetch featured products
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of featured products
 */
export async function getFeaturedProducts(params = {}) {
  return getProducts({
    featured: true,
    ...params,
  });
}

/**
 * Fetch product reviews
 * @param {string|number} productId - Product ID
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of reviews
 */
export async function getProductReviews(productId, params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.per_page || 10,
    page: params.page || 1,
  });

  return fetchFromBackend(`/wp-json/wc/v3/products/${productId}/reviews?${queryParams}`);
}

/**
 * Fetch store info (general settings)
 * @returns {Promise<object>} - Store settings
 */
export async function getStoreSettings() {
  return fetchFromBackend('/wp-json/wc/v3/settings/general');
}

/**
 * Fetch all orders (requires authentication - use with caution)
 * @param {object} params - Query parameters
 * @returns {Promise<array>} - Array of orders
 */
export async function getOrders(params = {}) {
  const queryParams = new URLSearchParams({
    per_page: params.per_page || 10,
    page: params.page || 1,
    status: params.status || 'any',
  });

  return fetchFromBackend(`/wp-json/wc/v3/orders?${queryParams}`);
}

/**
 * Fetch customer info (requires authentication)
 * @param {string|number} customerId - Customer ID
 * @returns {Promise<object>} - Customer data
 */
export async function getCustomer(customerId) {
  return fetchFromBackend(`/wp-json/wc/v3/customers/${customerId}`);
}

/**
 * Create an order (requires authentication)
 * @param {object} orderData - Order data to create
 * @returns {Promise<object>} - Created order
 */
export async function createOrder(orderData) {
  return fetchFromBackend('/wp-json/wc/v3/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/**
 * Generic method to fetch any WooCommerce endpoint
 * @param {string} endpoint - WooCommerce API endpoint path
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export async function fetchWooCommerceAPI(endpoint, options = {}) {
  return fetchFromBackend(endpoint, options);
}

export default {
  getProducts,
  getProductById,
  searchProducts,
  getCategories,
  getCategoryById,
  getProductsByCategory,
  getTags,
  getOnSaleProducts,
  getFeaturedProducts,
  getProductReviews,
  getStoreSettings,
  getOrders,
  getCustomer,
  createOrder,
  fetchWooCommerceAPI,
};
