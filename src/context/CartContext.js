'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);

// Initial state
const initialState = {
  items: [],
  isOpen: false,
  cartKey: null, // WooCommerce cart session key
  loading: false,
};

// Action types
export const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  TOGGLE_CART: 'TOGGLE_CART',
  CLEAR_CART: 'CLEAR_CART',
  SET_LOADING: 'SET_LOADING',
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.SET_CART: {
      return {
        ...state,
        items: action.payload.items || [],
        cartKey: action.payload.cartKey || null,
        loading: false,
      };
    }

    case CART_ACTIONS.ADD_ITEM: {
      // Add new item (existing items are handled in addItem function via updateQuantity)
      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true // Open cart when adding items
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case CART_ACTIONS.TOGGLE_CART: {
      return {
        ...state,
        isOpen: action.payload ?? !state.isOpen,
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
      };
    }

    case CART_ACTIONS.SET_LOADING: {
      return {
        ...state,
        loading: action.payload,
      };
    }

    default:
      return state;
  }
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [nonce, setNonce] = React.useState('');

  // Fetch cart and nonce from WooCommerce on mount
  useEffect(() => {
    fetchCartAndNonce();
  }, []);

  const fetchCartAndNonce = async () => {
    try {
      const response = await fetch('/api/cart/nonce');
      if (response.ok) {
        const data = await response.json();
        setNonce(data.nonce || '');
        const items = parseWooCommerceCart(data.cart);
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: { items, cartKey: data.cart?.cart_key },
        });
      }
    } catch (error) {
      console.error('Error fetching cart and nonce:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'X-WC-Store-API-Nonce': nonce,
        },
      });
      if (response.ok) {
        const cartData = await response.json();
        const items = parseWooCommerceCart(cartData);
        dispatch({
          type: CART_ACTIONS.SET_CART,
          payload: { items, cartKey: cartData.cart_key },
        });

        // Update nonce if returned
        const newNonce = response.headers.get('X-WC-Store-API-Nonce');
        if (newNonce) {
          setNonce(newNonce);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const parseWooCommerceCart = (cartData) => {
    if (!cartData || !cartData.items) return [];

    return cartData.items.map(item => ({
      id: item.id,
      key: item.key, // WooCommerce cart item key for updates/removal
      name: item.name,
      price: parseFloat(item.prices.price) / 100, // Convert from paise to rupees
      image: item.images?.[0]?.src || '/placeholder.jpg',
      quantity: item.quantity,
      size: item.variation?.[0]?.value || 'Default',
      currencySymbol: item.prices?.currency_symbol || '₹',
    }));
  };

  const addItem = async (item) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await fetch('/api/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WC-Store-API-Nonce': nonce,
        },
        body: JSON.stringify({
          id: item.id,
          quantity: item.quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }

      const cartData = await response.json();
      const items = parseWooCommerceCart(cartData);

      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items, cartKey: cartData.cart_key },
      });

      // Update nonce if returned
      const newNonce = response.headers.get('X-WC-Store-API-Nonce');
      if (newNonce) {
        setNonce(newNonce);
      }

      dispatch({ type: CART_ACTIONS.TOGGLE_CART, payload: true });
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const removeItem = async (item) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await fetch('/api/cart/remove-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WC-Store-API-Nonce': nonce,
        },
        body: JSON.stringify({ key: item.key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }

      const cartData = await response.json();
      const items = parseWooCommerceCart(cartData);

      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items, cartKey: cartData.cart_key },
      });

      // Update nonce if returned
      const newNonce = response.headers.get('X-WC-Store-API-Nonce');
      if (newNonce) {
        setNonce(newNonce);
      }

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateQuantity = async (itemKey, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await fetch('/api/cart/update-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WC-Store-API-Nonce': nonce,
        },
        body: JSON.stringify({ key: itemKey, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update item quantity');
      }

      const cartData = await response.json();
      const items = parseWooCommerceCart(cartData);

      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: { items, cartKey: cartData.cart_key },
      });

      // Update nonce if returned
      const newNonce = response.headers.get('X-WC-Store-API-Nonce');
      if (newNonce) {
        setNonce(newNonce);
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error(error.message || 'Failed to update item quantity');
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const toggleCart = (isOpen) => {
    dispatch({ type: CART_ACTIONS.TOGGLE_CART, payload: isOpen });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = state.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        loading: state.loading,
        nonce,
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        clearCart,
        fetchCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}