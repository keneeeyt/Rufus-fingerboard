"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';


const CartContext = createContext<any | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<any[] | null>(null);
  const [isError, setError] = useState(false);

  const refreshCart = async () => {
    try {
      const resp = await axios.get('/api/store/cart');
      setCart(resp.data);
    } catch (err) {
      setError(true);
      console.error(err);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, refreshCart, isError }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
