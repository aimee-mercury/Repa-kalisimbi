import React, { createContext, useState, useEffect } from 'react'
import { pushWebsiteNotification } from './utils/notifications'

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

const CART_ITEMS_KEY = 'cart_items'
const DASHBOARD_PRODUCTS_KEY = 'dashboardProducts'
const LANDING_PRODUCTS_KEY = 'landingPostedProducts'

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_ITEMS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
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

  const checkout = () => {
    if (cartItems.length === 0) return false

    try {
      const dashboardProducts = JSON.parse(localStorage.getItem(DASHBOARD_PRODUCTS_KEY) || '[]')
      const landingProducts = JSON.parse(localStorage.getItem(LANDING_PRODUCTS_KEY) || '[]')

      const purchasedById = cartItems.reduce((acc, item) => {
        const key = item.sourceProductId || item.id
        if (!key) return acc
        acc[key] = (acc[key] || 0) + Number(item.quantity || 0)
        return acc
      }, {})

      const nextDashboardProducts = dashboardProducts.map((product) => {
        const soldNow = purchasedById[product.id] || 0
        if (!soldNow) return product

        const currentStock = Number(product.stock || 0)
        const nextStock = Math.max(0, currentStock - soldNow)
        const currentSoldUnits = Number(product.soldUnits || 0)

        return {
          ...product,
          stock: nextStock,
          soldUnits: currentSoldUnits + soldNow,
          status: nextStock > 0 ? 'IN STOCK' : 'OUT OF STOCK',
        }
      })

      const nextLandingProducts = landingProducts
        .map((product) => {
          const soldNow = purchasedById[product.id] || 0
          if (!soldNow) return product

          const currentStock = Number(product.stock || 0)
          const nextStock = Math.max(0, currentStock - soldNow)

          return {
            ...product,
            stock: nextStock,
          }
        })
        .filter((product) => Number(product.stock ?? 1) > 0)

      localStorage.setItem(DASHBOARD_PRODUCTS_KEY, JSON.stringify(nextDashboardProducts))
      localStorage.setItem(LANDING_PRODUCTS_KEY, JSON.stringify(nextLandingProducts))
      setCartItems([])

      pushWebsiteNotification({
        type: 'order',
        title: 'Order Completed',
        message: `${cartItems.length} cart item(s) were checked out and stock was updated.`,
      })

      return true
    } catch {
      return false
    }
  }

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(cartItems))
      window.dispatchEvent(new Event('storage'))
    } catch {
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
      getTotalPrice,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  )
}
