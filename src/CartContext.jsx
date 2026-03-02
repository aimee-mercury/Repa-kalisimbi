import React, { createContext, useState, useEffect } from 'react'
import { pushWebsiteNotification } from './utils/notifications'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart_items')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const addToCart = (product, quantity) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity }])
    }

    pushWebsiteNotification({
      type: 'add_to_cart',
      title: 'Product Added to Cart',
      message: `${product?.name || product?.title || 'Product'} x${quantity} was added to cart.`,
      meta: {
        productId: product?.id || '',
        quantity
      }
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(cartItems))
    } catch (e) {
      // ignore storage errors
    }
  }, [cartItems])

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}
