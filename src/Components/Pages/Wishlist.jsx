import React from "react";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../CurrencyContext";
import { useWishlist } from "../../WishlistContext";
import Footer from "../Layout/Footer";

export default function Wishlist() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const { items, removeFromWishlist } = useWishlist();

  return (
    <main className="wishlist-page container">
      <div className="store-eyebrow">YOUR PERSONAL SHORTLIST</div>
      <div className="wishlist-heading"><div><h1>Saved for later</h1><p>All the things you love, together in one place.</p></div><span>{items.length} {items.length === 1 ? "item" : "items"}</span></div>
      {items.length ? (
        <div className="wishlist-grid">
          {items.map((item) => (
            <article className="wishlist-item" key={item.id}>
              <button type="button" className="wishlist-item-image" onClick={() => navigate("/product", { state: { product: item } })}><img src={item.image} alt={item.name} /></button>
              <div className="wishlist-item-info"><span>{item.category}</span><button type="button" className="wishlist-item-title" onClick={() => navigate("/product", { state: { product: item } })}>{item.name}</button><strong>{formatCurrency(item.price)}</strong></div>
              <div className="wishlist-item-actions">
                <button type="button" className="store-button store-button-dark" onClick={() => navigate("/product", { state: { product: item } })}><ShoppingBag size={16} /> View product</button>
                <button type="button" className="wishlist-remove" onClick={() => removeFromWishlist(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={17} /> Remove</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="wishlist-empty"><div><Heart size={28} /></div><h2>Your wishlist is waiting</h2><p>Tap the heart on anything you love and it will be right here.</p><button type="button" className="store-button store-button-dark" onClick={() => navigate("/category")}>Explore products <ArrowRight size={17} /></button></section>
      )}
      <Footer />
    </main>
  );
}
