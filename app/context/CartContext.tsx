// CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export interface ShippingOption {
  label: string;
  cost: number;
}

export interface CartItem {
  slug: string;
  name: string;
  price: string;
  quantity: number;
  mainImage: string;
  option?: string | null;
  originalPrice?: string; // Add this
  discount?: string; // Add this
}

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  cartCount: number;
  isCartOpen: boolean;
  selectedShipping: ShippingOption | null;
  setSelectedShipping: (shipping: ShippingOption | null) => void;
  addToCart: (item: CartItem) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const pathname = usePathname();

  const totalPrice = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.cart) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.slug === item.slug);
      if (existingItem) {
        return prevItems.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: item.slug,
          quantity: item.quantity,
          price: item.price,
          option: item.option,
          name: item.name,
          mainImage: item.mainImage,
        }),
      });
      const data = await res.json();
      if (data.cart) setCartItems(data.cart.items);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }

    setIsCartOpen(true);
  };

  const updateQuantity = async (slug: string, quantity: number) => {
    if (quantity <= 0) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, quantity }),
      });
      const data = await res.json();
      if (data.cart) setCartItems(data.cart.items);
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const removeFromCart = async (slug: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.slug !== slug));

    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.cart) setCartItems(data.cart.items);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartDrawer = document.getElementById('cart-drawer');
      if (isCartOpen && cartDrawer && !cartDrawer.contains(event.target as Node)) {
        closeCart();
      }
    };

    if (isCartOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        cartCount,
        isCartOpen,
        selectedShipping,
        setSelectedShipping,
        addToCart,
        updateQuantity,
        removeFromCart,
        openCart,
        closeCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
