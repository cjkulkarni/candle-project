'use client';

import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

// Initial state
const initialState = {
  items: [],
  isOpen: false,
};

// Action types
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  TOGGLE_CART: 'TOGGLE_CART',
  CLEAR_CART: 'CLEAR_CART',
};

// Reducer function
function cartReducer(state, action) {
  switch (action.type) {
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

    default:
      return state;
  }
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => {
    // Check if item already exists in cart
    const existingItem = state.items.find(
      cartItem => cartItem.id === item.id && cartItem.size === item.size
    );

    if (existingItem) {
      // Item already exists, update quantity by adding to existing quantity
      updateQuantity(item.id, item.size, existingItem.quantity + item.quantity);
      // Also open the cart
      dispatch({ type: CART_ACTIONS.TOGGLE_CART, payload: true });
    } else {
      // New item, add it to cart
      dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
    }
  };

  const removeItem = (item) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: item });
  };

  const updateQuantity = (id, size, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, size, quantity },
    });
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
        addItem,
        removeItem,
        updateQuantity,
        toggleCart,
        clearCart,
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