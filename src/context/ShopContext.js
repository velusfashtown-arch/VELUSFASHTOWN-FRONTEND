import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ShopContext = createContext(null);
const CART_STORAGE_KEY = 'velus-fashtown-cart';
const WISHLIST_STORAGE_KEY = 'velus-fashtown-wishlist';

function loadStorage(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => loadStorage(CART_STORAGE_KEY));
  const [wishlist, setWishlist] = useState(() => loadStorage(WISHLIST_STORAGE_KEY));

  useEffect(() => { window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const value = useMemo(() => {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0);

    function addToCart(product, quantity = 1) {
      if (!product?.id) return;
      setCart((items) => {
        const existing = items.find((item) => item.id === product.id);
        const availableStock = Number(product.stock || 0);
        if (existing) {
          const nextQuantity = availableStock ? Math.min(existing.quantity + quantity, availableStock) : existing.quantity + quantity;
          return items.map((item) => item.id === product.id ? { ...item, ...product, quantity: nextQuantity } : item);
        }
        return [...items, { ...product, quantity: availableStock ? Math.min(quantity, availableStock) : quantity }];
      });
    }

    function updateQuantity(productId, quantity) {
      setCart((items) => items
        .map((item) => item.id === productId ? { ...item, quantity: Math.max(0, Math.min(Number(quantity) || 0, Number(item.stock || 99))) } : item)
        .filter((item) => item.quantity > 0));
    }

    function removeFromCart(productId) { setCart((items) => items.filter((item) => item.id !== productId)); }
    function clearCart() { setCart([]); }
    function toggleWishlist(product) {
      if (!product?.id) return;
      setWishlist((items) => items.some((item) => item.id === product.id) ? items.filter((item) => item.id !== product.id) : [...items, product]);
    }

    return { cart, wishlist, cartCount, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, toggleWishlist };
  }, [cart, wishlist]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}
