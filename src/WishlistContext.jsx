/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { pushWebsiteNotification } from "./utils/notifications";

export const WishlistContext = createContext(null);
const STORAGE_KEY = "wishlist_items";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("storage"));
    } catch {
      /* ignore */
    }
  }, [items]);

  const isSaved = (id) => items.some((item) => String(item.id) === String(id));

  const toggleWishlist = (product) => {
    if (!product?.id && !product?.name) return false;
    const id = product.id || product.name;
    const exists = isSaved(id);
    if (exists) {
      setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
      return false;
    }
    setItems((prev) => [
      ...prev,
      {
        id,
        name: product.name || product.title,
        title: product.title || product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || product.images?.[0],
        category: product.category || "PRODUCT",
        rating: product.rating || 5,
        reviews: product.reviews || 0,
      },
    ]);
    pushWebsiteNotification({
      type: "like",
      title: "Saved to wishlist",
      message: `${product.name || product.title} was added to your wishlist.`,
    });
    return true;
  };

  const removeFromWishlist = (id) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, removeFromWishlist, isSaved, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
