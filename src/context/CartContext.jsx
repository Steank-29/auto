// src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateTotals();
  }, [cartItems]);

  // Update total items and price
  const updateTotals = () => {
    const items = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalItems(items);
    setTotalPrice(price);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedLogo = null) => {
    setLoading(true);
    setError(null);

    try {
      const existingItem = cartItems.find(item => item.productId === product._id);

      if (existingItem) {
        // Update quantity if item already exists
        const updatedCart = cartItems.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        setCartItems(updatedCart);
      } else {
        // Add new item
        const newItem = {
          productId: product._id,
          name: product.name,
          brand: product.brand,
          model: product.model,
          price: product.price,
          discountPrice: product.discountPrice || null,
          mainImage: product.mainImage,
          quantity: quantity,
          selectedLogo: selectedLogo || product.brand,
          stock: product.stock,
          maxStock: product.stock,
        };
        setCartItems([...cartItems, newItem]);
      }

      // Show success message (optional)
      setLoading(false);
      return { success: true, message: 'Prodotto aggiunto al carrello!' };
    } catch (err) {
      setError(err.message || 'Errore durante l\'aggiunta al carrello');
      setLoading(false);
      return { success: false, message: err.message || 'Errore durante l\'aggiunta al carrello' };
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setLoading(true);
    try {
      const updatedCart = cartItems.filter(item => item.productId !== productId);
      setCartItems(updatedCart);
      setLoading(false);
      return { success: true, message: 'Prodotto rimosso dal carrello!' };
    } catch (err) {
      setError(err.message || 'Errore durante la rimozione');
      setLoading(false);
      return { success: false, message: err.message || 'Errore durante la rimozione' };
    }
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true);
    try {
      const updatedCart = cartItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(newQuantity, item.maxStock || 99) }
          : item
      );
      setCartItems(updatedCart);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Errore durante l\'aggiornamento');
      setLoading(false);
      return { success: false, message: err.message || 'Errore durante l\'aggiornamento' };
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Get cart item count
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // Sync cart with backend (optional)
  const syncCartWithBackend = async () => {
    try {
      const response = await axiosInstance.post('/cart/sync', { cartItems });
      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      return { success: false, message: 'Errore durante la sincronizzazione del carrello' };
    }
  };

  // Value object to provide to consumers
  const value = {
    cartItems,
    loading,
    error,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    isInCart,
    getItemQuantity,
    syncCartWithBackend,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;