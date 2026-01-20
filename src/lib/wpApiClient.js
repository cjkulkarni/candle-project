'use client';

// Next.js API Routes (Backend)
// All requests are proxied through Next.js API routes for security
const ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VALIDATE_TOKEN: '/api/auth/validate',
  GET_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
};

/**
 * WordPress API Client
 * Handles authentication with WordPress REST API
 */
export const wpApiClient = {
  /**
   * Login user with email and password
   * @param {string} email - User email or username
   * @param {string} password - User password
   * @param {string} recaptchaToken - reCAPTCHA token (optional)
   * @returns {Promise} { token, user }
   */
  login: async (email, password, recaptchaToken = null) => {
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || 'Login failed';
          // Strip HTML tags from error message (WordPress may return HTML)
          errorMessage = errorMessage.replace(/<[^>]*>/g, '').trim();
        } catch (jsonError) {
          // If JSON parsing fails, use status code
          errorMessage = `Login failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      // Ensure we always throw an Error object with a message property
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error) || 'Login failed');
    }
  },

  /**
   * Login with username (alternative)
   * @param {string} username - User username
   * @param {string} password - User password
   * @returns {Promise} { token, user }
   */
  loginWithUsername: async (username, password) => {
    try {
      const response = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user using WooCommerce API
   * @param {object} userData - User registration data
   * @returns {Promise} { token, user }
   */
  register: async (userData) => {
    try {
      const response = await fetch(ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          password: userData.password,
          address: userData.address,
          city: userData.city,
          zipCode: userData.zipCode,
          country: userData.country,
          recaptchaToken: userData.recaptchaToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Validate JWT token
   * @param {string} token - JWT token
   * @returns {Promise} { valid }
   */
  validateToken: async (token) => {
    try {
      const response = await fetch(ENDPOINTS.VALIDATE_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        return { valid: false };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  },

  /**
   * Get user profile
   * @param {string} token - JWT token
   * @returns {Promise} user object
   */
  getUserProfile: async (token) => {
    try {
      const response = await fetch(
        `${ENDPOINTS.GET_PROFILE}?token=${encodeURIComponent(token)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {object} updateData - Data to update
   * @param {string} token - JWT token
   * @returns {Promise} updated user object
   */
  updateUserProfile: async (updateData, token) => {
    try {
      const response = await fetch(
        `${ENDPOINTS.UPDATE_PROFILE}?token=${encodeURIComponent(token)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  /**
   * Logout user (clear token)
   * @returns {void}
   */
  logout: () => {
    // Token is handled on client side
    // No API call needed for logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // =====================================================
  // PRODUCTS API
  // =====================================================

  /**
   * Get all products
   * @returns {Promise} Array of products
   */
  getProducts: async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  /**
   * Get single product
   * @param {number} productId - Product ID
   * @returns {Promise} Product details
   */
  getProduct: async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return await response.json();
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },

  /**
   * Get product categories
   * @returns {Promise} Array of categories
   */
  getCategories: async () => {
    try {
      const response = await fetch('/api/products/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // =====================================================
  // CART API
  // =====================================================

  /**
   * Get current cart
   * @returns {Promise} Cart contents
   */
  getCart: async () => {
    try {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  },

  /**
   * Add item to cart
   * @param {object} item - Product ID and quantity
   * @returns {Promise} Updated cart
   */
  addToCart: async (item) => {
    try {
      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   * @param {string} cartItemKey - Cart item key
   * @returns {Promise} Updated cart
   */
  removeFromCart: async (cartItemKey) => {
    try {
      const response = await fetch('/api/cart/remove-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: cartItemKey }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }
      return await response.json();
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   * @param {object} data - Cart item key and new quantity
   * @returns {Promise} Updated cart
   */
  updateCartItem: async (data) => {
    try {
      const response = await fetch('/api/cart/update-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }
      return await response.json();
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  },

  /**
   * Apply coupon to cart
   * @param {string} code - Coupon code
   * @returns {Promise} Updated cart with coupon applied
   */
  applyCoupon: async (code) => {
    try {
      const response = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to apply coupon');
      }
      return await response.json();
    } catch (error) {
      console.error('Apply coupon error:', error);
      throw error;
    }
  },

  /**
   * Remove coupon from cart
   * @param {string} code - Coupon code
   * @returns {Promise} Updated cart
   */
  removeCoupon: async (code) => {
    try {
      const response = await fetch('/api/cart/remove-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove coupon');
      }
      return await response.json();
    } catch (error) {
      console.error('Remove coupon error:', error);
      throw error;
    }
  },

  // =====================================================
  // CHECKOUT API
  // =====================================================

  /**
   * Create order during checkout
   * @param {object} orderData - Order details
   * @param {string} token - JWT token
   * @returns {Promise} Created order
   */
  checkout: async (orderData, token) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      return await response.json();
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },
};

export default wpApiClient;
