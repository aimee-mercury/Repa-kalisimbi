import React, { useState, useContext } from "react";
import { Star, Heart, Share2, Minus, Plus } from "lucide-react";
import { CartContext } from "../../CartContext";
import { useLocation } from 'react-router-dom'
import "../../Styles/Product.scss";
import Footer from "../Layout/Footer";

const ProductPage = () => {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specification");
  const [selectedColor, setSelectedColor] = useState("Off White");
  const [showCartMessage, setShowCartMessage] = useState(false);

  const location = useLocation()

  const defaultProduct = {
    title: "NexSUS ROCK Strix Scar 17 Gaming Laptop 15.7\" 1TB SSD 16GB RAM Pro",
    price: 2999.99,
    originalPrice: 4499.99,
    rating: 4.5,
    reviews: 142,
    brand: "NexSUS Tech Company",
    size: "15.7 x 11 x 1.0 inches (W x D x H)",
    weight: "6.28 pounds",
    delivery: "Worldwide",
    colors: ["Off White", "Space Gray", "Jet Black"],
    images: [
      "/Images/comp1.jpg",
      "/Images/comp2.jpg",
      "/Images/comp3.jpg",
    ],
  }

  const passed = location && location.state && location.state.product ? location.state.product : null

  let product = defaultProduct
  if (passed) {
    // Normalize incoming product fields (handle strings like "$99.99")
    const parsePrice = (val, fallback) => {
      if (val == null) return fallback;
      const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
      return Number.isFinite(num) ? num : fallback;
    };

    product = {
      ...defaultProduct,
      title: passed.title || passed.name || defaultProduct.title,
      price: parsePrice(passed.price, defaultProduct.price),
      originalPrice: parsePrice(passed.originalPrice, defaultProduct.originalPrice),
      rating: (passed.rating != null && !Number.isNaN(Number(passed.rating))) ? Number(passed.rating) : defaultProduct.rating,
      reviews: (passed.reviews != null && !Number.isNaN(Number(passed.reviews))) ? parseInt(passed.reviews, 10) : defaultProduct.reviews,
      brand: passed.brand ?? defaultProduct.brand,
      size: passed.size ?? defaultProduct.size,
      weight: passed.weight ?? defaultProduct.weight,
      delivery: passed.delivery ?? defaultProduct.delivery,
      colors: passed.colors ?? defaultProduct.colors,
      images: passed.images ?? (passed.image ? [passed.image] : defaultProduct.images),
    }
  }

  const specs = {
    Brand: "NexSUS Tech Company",
    Display: "17.3-inch Full HD (1920 x 1080) IPS panel, 144Hz",
    Processor: "Intel Core i9-10900H 8-core, 16-thread",
    Graphics: "NVIDIA GeForce RTX 3080 (16GB GDDR6 VRAM)",
    Memory: "32GB DDR4-3200 RAM",
    Storage: "1TB PCIe NVMe M.2 SSD",
    Audio: "2 x 4W speakers with Smart Amp technology",
    Connection: "Wi-Fi 6 (802.11ax), Bluetooth 5.1, Gigabit Ethernet, HDMI",
    Keyboard: "RGB Cherry Keyboard, N-key rollover, per-key RGB lighting",
    Battery: "4-cell 90Wh lithium battery (up to 8 hours battery life)",
    Dimensions: "15.7 x 11 x 1.0 inches (W x D x H)",
  };

  const relatedProducts = [
    {
      id: 1,
      name: "Gaming Laptop ZDY 15.6 inch i12 GB SSD VGA",
      price: 1659.0,
      originalPrice: 1899.0,
      rating: 4,
      reviews: 156,
      image: "/Images/comp1.jpg",
      discount: -20,
    },
    {
      id: 2,
      name: "Surface Laptop 4 XPS 13 Plus 640B i7 Touch",
      price: 2399.99,
      originalPrice: 2799.99,
      rating: 4,
      reviews: 101,
      image: "/Images/comp2.jpg",
    },
    {
      id: 3,
      name: "2019 Smart Laptop 256 GB 13 inch Pro Chip",
      price: 2089.99,
      originalPrice: 2499.99,
      rating: 4,
      reviews: 201,
      image: "/Images/comp3.jpg",
    },
    {
      id: 4,
      name: "S21 Laptop Ultra HD LED Screen Feature 2023",
      price: 1199.0,
      originalPrice: 1599.0,
      rating: 3,
      reviews: 89,
      image: "/Images/comp1.jpg",
      discount: -30,
    },
    {
      id: 5,
      name: "Sleek Laptop HQ 256 GB SSD 8 GB Intel iCore",
      price: 1519.99,
      originalPrice: 1899.0,
      rating: 4,
      reviews: 201,
      image: "/Images/comp2.jpg",
    },
  ];

  const handleAddToCart = () => {
    const productToAdd = {
      id: Math.random(),
      title: product.title,
      name: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: 'LAPTOP',
      selectedColor: selectedColor,
      rating: product.rating,
      reviews: product.reviews,
    };
    
    addToCart(productToAdd, quantity);
    setShowCartMessage(true);
    setTimeout(() => setShowCartMessage(false), 2000);
  };

  const handleBuyNow = () => {
    const message = `Hi! I'm interested in purchasing:\n\n*Product:* ${product.title}\n*Price:* $${product.price.toFixed(2)}\n*Color:* ${selectedColor}\n*Quantity:* ${quantity}\n\nPlease provide more details and proceed with the order.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/250732659689?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="product-page">
      {/* Main Product Section */}
      <div className="container product-main">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Home</span>
          <span>/</span>
          <span>Computers & Tablets</span>
          <span>/</span>
          <span>Laptop</span>
          <span>/</span>
          <span className="active">NexSUS ROCK Strix Scar 17 Gaming Laptop</span>
        </div>

        <div className="product-content">
          {/* Product Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[0]} alt={product.title} />
              <button className="zoom-btn">⤢</button>
            </div>
            <div className="thumbnails">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Product ${idx + 1}`} />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            {/* Rating */}
            <div className="rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? "filled" : ""}
                  />
                ))}
              </div>
              <span className="review-count">({product.reviews})</span>
            </div>

            <h1 className="product-title">{product.title}</h1>

            {/* Price */}
            <div className="price-section">
              <span className="price">${product.price.toFixed(2)}</span>
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            </div>

            {/* Product Info */}
            <div className="info-grid">
              <div className="info-item">
                <label>Brand</label>
                <value>{product.brand}</value>
              </div>
              <div className="info-item">
                <label>Size</label>
                <value>{product.size}</value>
              </div>
              <div className="info-item">
                <label>Weight</label>
                <value>{product.weight}</value>
              </div>
              <div className="info-item">
                <label>Delivery</label>
                <value>{product.delivery}</value>
              </div>
              <div className="info-item">
                <label>Variant</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${
                        selectedColor === color ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <div className="badge-icon">📦</div>
                <div className="badge-text">
                  <strong>Free Shipping</strong>
                  <p>Worldwide available</p>
                </div>
              </div>
              <div className="badge">
                <div className="badge-icon">✓</div>
                <div className="badge-text">
                  <strong>100% Guaranteed</strong>
                  <p>Receive product first</p>
                </div>
              </div>
              <div className="badge">
                <div className="badge-icon">↩</div>
                <div className="badge-text">
                  <strong>Return Available</strong>
                  <p>See return policy</p>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button className="btn-buy-now" onClick={handleBuyNow}>Buy Now</button>
              <button className="btn-add-cart" onClick={handleAddToCart}>
                <Heart size={18} />
              </button>
            </div>

            {showCartMessage && (
              <div className="cart-message" style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: '#10b981',
                color: 'white',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                ✓ Added {quantity} item(s) to cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container tabs-section">
        <div className="tabs-header">
          <button
            className={`tab ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          <button
            className={`tab ${activeTab === "specification" ? "active" : ""}`}
            onClick={() => setActiveTab("specification")}
          >
            Specification
          </button>
          <button
            className={`tab ${activeTab === "return" ? "active" : ""}`}
            onClick={() => setActiveTab("return")}
          >
            Return
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "specification" && (
            <div className="spec-table">
              <div className="spec-grid">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="spec-row">
                    <div className="spec-label">{key}</div>
                    <div className="spec-value">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "description" && (
            <div className="description-content">
              <p>
                Experience ultimate gaming performance with the NexSUS ROCK Strix
                Scar 17. Featuring a powerful Intel Core i9 processor, RTX 3080
                graphics, and 144Hz display for immersive gameplay.
              </p>
            </div>
          )}
          {activeTab === "return" && (
            <div className="return-content">
              <p>30-day return policy. Full refund if not satisfied.</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="reviews-content">
              <p>No reviews yet. Be the first to review this product.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="container related-section">
        <div className="section-header">
          <h2>Related Products</h2>
          <a href="#" className="view-all">
            View All →
          </a>
        </div>
        <div className="related-grid">
          {relatedProducts.map((prod) => (
            <div key={prod.id} className="related-card">
              {prod.discount && (
                <span className="discount-badge">{prod.discount}%</span>
              )}
              <div className="product-image">
                <img src={prod.image} alt={prod.name} />
              </div>
              <div className="product-info">
                <p className="category">LAPTOP</p>
                <p className="name">{prod.name}</p>
                <div className="rating-small">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < prod.rating ? "filled" : ""}
                    />
                  ))}
                  <span>({prod.reviews})</span>
                </div>
                <div className="price-small">
                  <span className="price">${prod.price}</span>
                  {prod.originalPrice && (
                    <span className="original">${prod.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="container newsletter-content">
          <div className="newsletter-text">
            <h2>Get Up-to-Date Gadget Technology</h2>
            <p>
              Browse our wide selection of electronics and find the perfect promo
              for you from newsletter.
            </p>
            <button className="btn-shop-now">Shop Now</button>
          </div>
          <div className="newsletter-image">
            <img src="/Images/comp2.jpg" alt="Newsletter" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
