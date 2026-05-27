'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const CART_KEY = 'electroshop_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCartItems(JSON.parse(stored));
    } catch {
      localStorage.removeItem(CART_KEY);
    }
    setHydrated(true);
  }, []);

  // Persist cart whenever it changes (after hydration)
  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find((i) => i._id === product._id);
    if (existing) {
      const newQty = existing.qty + quantity;
      if (newQty > product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      setCartItems((prev) => prev.map((i) => (i._id === product._id ? { ...i, qty: newQty } : i)));
      toast.success('Cart updated');
    } else {
      if (quantity > product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      setCartItems((prev) => [...prev, { ...product, qty: quantity }]);
      toast.success(`${product.name} added to cart`);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i._id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i._id === productId ? { ...i, qty: newQty } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const isInCart = (productId) => cartItems.some((i) => i._id === productId);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
};
