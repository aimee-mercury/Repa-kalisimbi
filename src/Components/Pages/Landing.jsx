import React, { useContext, useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Heart, ShieldCheck, ShoppingBag, Truck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../CartContext";
import { useCurrency } from "../../CurrencyContext";
import { useWishlist } from "../../WishlistContext";
import { CATALOG, CATEGORY_NAV } from "../../data/catalog";
import Footer from "../Layout/Footer";

const featuredIds = ["p-mbp-14", "p-iphone-15", "p-rog-g14"];

function ProductCard({ product, onOpen, onAdd, formatCurrency, isSaved, onWishlist }) {
  return (
    <article className="store-product-card">
      <div className="store-product-image" role="button" tabIndex={0} onClick={onOpen} onKeyDown={(event) => event.key === "Enter" && onOpen()}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.originalPrice > product.price && (
          <span className="store-product-badge">Save {Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        )}
        <button
          type="button"
          className={`store-wishlist ${isSaved ? "is-saved" : ""}`}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={(event) => { event.stopPropagation(); onWishlist(); }}
        >
          <Heart size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="store-product-details">
        <span className="store-product-category">{product.category}</span>
        <button type="button" className="store-product-name" onClick={onOpen}>{product.name}</button>
        <div className="store-product-rating"><span aria-label={`${product.rating} out of 5 stars`}>★★★★★</span><small>({product.reviews})</small></div>
        <div className="store-product-bottom">
          <div>
            <strong>{formatCurrency(product.price)}</strong>
            {product.originalPrice > product.price && <del>{formatCurrency(product.originalPrice)}</del>}
          </div>
          <button type="button" className="store-add-button" aria-label={`Add ${product.name} to cart`} onClick={onAdd}>
            <ShoppingBag size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function HomeHero() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isSaved } = useWishlist();
  const [activeSlide, setActiveSlide] = useState(0);
  const featuredProducts = useMemo(
    () => featuredIds.map((id) => CATALOG.find((product) => product.id === id)).filter(Boolean),
    []
  );
  const heroProduct = featuredProducts[activeSlide];
  const popularProducts = CATALOG.filter((product) => product.tags?.includes("popular") || product.tags?.includes("featured")).slice(0, 8);
  const openProduct = (product) => navigate("/product", { state: { product } });

  return (
    <main className="store-home">
      <section className="store-hero container">
        <div className="store-hero-copy">
          <div className="store-eyebrow"><span /> THE REPA EDIT · 2026</div>
          <h1>Better tech.<br /><em>Better every day.</em></h1>
          <p>Thoughtfully selected devices and everyday essentials, backed by people who know their tech.</p>
          <div className="store-hero-actions">
            <button type="button" className="store-button store-button-dark" onClick={() => navigate("/category")}>Explore the collection <ArrowRight size={17} /></button>
            <span className="store-hero-note"><ShieldCheck size={16} /> Genuine products, always</span>
          </div>
          <div className="store-hero-index">
            <span>0{activeSlide + 1}</span><div><i style={{ width: `${((activeSlide + 1) / featuredProducts.length) * 100}%` }} /></div><span>0{featuredProducts.length}</span>
            <button type="button" aria-label="Previous featured product" onClick={() => setActiveSlide((activeSlide + featuredProducts.length - 1) % featuredProducts.length)}><ChevronLeft size={17} /></button>
            <button type="button" aria-label="Next featured product" onClick={() => setActiveSlide((activeSlide + 1) % featuredProducts.length)}><ChevronRight size={17} /></button>
          </div>
        </div>
        <button type="button" className="store-hero-visual" onClick={() => openProduct(heroProduct)} aria-label={`View ${heroProduct.name}`}>
          <span className="store-hero-orbit" />
          <img key={heroProduct.id} src={heroProduct.image} alt={heroProduct.name} />
          <span className="store-hero-caption"><span>EDITOR&apos;S PICK</span><strong>{heroProduct.name}</strong><span>{formatCurrency(heroProduct.price)} <ArrowUpRight size={15} /></span></span>
          <span className="store-hero-stamp"><Zap size={15} /> NEW SEASON</span>
        </button>
      </section>

      <section className="store-trust-strip container" aria-label="Shopping benefits">
        <div><Truck size={19} /><span><strong>Fast delivery</strong><small>Tracked to your door</small></span></div>
        <div><ShieldCheck size={19} /><span><strong>Quality checked</strong><small>Only trusted products</small></span></div>
        <div><Check size={19} /><span><strong>Easy support</strong><small>Here when you need us</small></span></div>
        <div><Zap size={19} /><span><strong>Great value</strong><small>Fair prices, no fuss</small></span></div>
      </section>

      <section className="store-section container">
        <div className="store-section-heading">
          <div><span className="store-eyebrow">FIND YOUR NEXT FAVOURITE</span><h2>Shop by category</h2></div>
          <button type="button" className="store-text-link" onClick={() => navigate("/category")}>View all categories <ArrowRight size={16} /></button>
        </div>
        <div className="store-category-grid">
          {CATEGORY_NAV.filter((category) => category.category !== "All Categories").map((category, index) => (
            <button type="button" className={`store-category-tile category-tone-${index % 4}`} key={category.category} onClick={() => navigate(`/category/${category.category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, { state: { category: category.category } })}>
              <span className="store-category-number">0{index + 1}</span><img src={category.image} alt="" loading="lazy" /><span className="store-category-label">{category.category}<ArrowUpRight size={17} /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="store-feature-band">
        <div className="container store-feature-content">
          <div><span className="store-eyebrow">MADE FOR YOUR EVERYDAY</span><h2>The right gear<br />changes everything.</h2><p>From your first work call to your next big adventure, find dependable tech that keeps up.</p><button type="button" className="store-button store-button-light" onClick={() => navigate("/category")}>Find your upgrade <ArrowRight size={17} /></button></div>
          <div className="store-feature-collage"><img src="/Images/lap.jpg" alt="Laptop and everyday tech" loading="lazy" /><span>GOOD TECH, GOOD ENERGY.</span><ArrowDownRight size={34} /></div>
        </div>
      </section>

      <section className="store-section container store-popular-section">
        <div className="store-section-heading">
          <div><span className="store-eyebrow">THE ONES EVERYONE LOVES</span><h2>Popular right now</h2><p>Good picks, picked for you.</p></div>
          <button type="button" className="store-text-link" onClick={() => navigate("/category")}>Shop all products <ArrowRight size={16} /></button>
        </div>
        <div className="store-product-grid">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              formatCurrency={formatCurrency}
              onOpen={() => openProduct(product)}
              onAdd={() => addToCart(product, 1)}
              isSaved={isSaved(product.id)}
              onWishlist={() => toggleWishlist(product)}
            />
          ))}
        </div>
      </section>

      <section className="store-about-callout container">
        <span>Repa Karisimbi · BUILT AROUND YOU</span>
        <p>Shopping for tech should feel exciting, not complicated.</p>
        <button type="button" onClick={() => navigate("/about")}>Get to know us <ArrowRight size={16} /></button>
      </section>
      <Footer />
    </main>
  );
}
