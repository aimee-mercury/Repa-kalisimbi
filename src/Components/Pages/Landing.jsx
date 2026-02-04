import React from "react";
import "../../Styles/Landing.scss";
import Footer from "../Layout/Footer";

const deals = [
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Bluetooth Speaker",
    price: "$39.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Gaming Mouse",
    price: "$29.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
   {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
   {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
];

const popularSearch = [
  {
    name: "Macbook Pro 2023",
    price: "$1,245.50",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Digital Camera",
    price: "$679.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Ultra-Book 13in",
    price: "$894.22",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "I Gel Images",
    price: "$49.12",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "LED Monitor 28",
    price: "$899.15",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "I Gel Images",
    price: "$49.12",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
];

const hotSaleProducts = [
  {
    name: "Digital Camera",
    price: "$679.99",
    rating: 5,
    image: "/Images/comp2.jpg",
    onSale: true,
  },
  {
    name: "LED Monitor 28\"",
    price: "$799.33",
    rating: 4,
    image: "/Images/comp3.jpg",
    onSale: true,
  },
  {
    name: "I Gel Images",
    price: "$49.33",
    rating: 4,
    image: "/Images/comp1.jpg",
    onSale: true,
  },
  {
    name: "Macbook Pro 2023",
    price: "$1,245.33",
    rating: 4,
    image: "/Images/comp3.jpg",
    onSale: true,
  },
  {
    name: "Ultra-Book 13in",
    price: "$894.22",
    rating: 5,
    image: "/Images/comp2.jpg",
    onSale: true,
  },
  {
    name: "Digital Camera",
    price: "$679.99",
    rating: 5,
    image: "/Images/comp2.jpg",
    onSale: true,
  },
];

const topProducts = [
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Full Sat Pad Devices",
    price: "$129.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "AirPods",
    price: "$249.99",
    rating: 5,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Smartphone",
    price: "$799.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Gaming Mouse",
    price: "$59.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Keyboard",
    price: "$99.99",
    rating: 5,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Monitor",
    price: "$299.99",
    rating: 4,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Webcam",
    price: "$69.99",
    rating: 5,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Speaker",
    price: "$89.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
];

const recentlyViewed = [
  {
    name: "Airpods 2nd Generation",
    price: "$99.50",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Wireless 5G",
    price: "$399.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Wireless 4G",
    price: "$199.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Smart Watch Elite",
    price: "$599.99",
    rating: 5,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Power Bank",
    price: "$79.99",
    rating: 4,
    image: "/Images/comp2.jpg",
  },
   {
    name: "Smart Watch Elite",
    price: "$599.99",
    rating: 5,
    image: "/Images/comp1.jpg",
  },
   {
    name: "Smart Watch Elite",
    price: "$599.99",
    rating: 5,
    image: "/Images/comp1.jpg",
  },
];

const HomeHero = () => {
  const topProductsGridRef = React.useRef(null);

  const scrollTopProducts = (direction) => {
    if (topProductsGridRef.current) {
      const scrollAmount = 220;
      topProductsGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="home">
      {/* Hero Banner */}
       <section className="hero container">
        <div className="hero-text">
          <small>Hot Products</small>
          <h1>Fill your desk full of technology</h1>
          <p>Start from <strong>$45.00</strong></p>
          <button>Learn More</button>
        </div>

        <img src="/Images/comp.jpg" alt="Hero" />
      </section>

      {/* Best Deals */}
      <div className="deals">
        <h2>Best Deals</h2>

        <div className="deals__grid">
          {deals.map((item, index) => (
            <div className="deal-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Selected Products */}
      <div className="top-products">
        <div className="top-products-header">
          <h2>Top 10 selected Products On the Week</h2>
          <div className="top-products-arrows">
            <button onClick={() => scrollTopProducts("left")}>‹</button>
            <button onClick={() => scrollTopProducts("right")}>›</button>
          </div>
        </div>
        <div className="top-products__grid" ref={topProductsGridRef}>
          {topProducts.map((item, index) => (
            <div className="top-product-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Search */}
      <div className="popular-search">
        <h2>Popular Search</h2>
        <div className="popular-search__grid">
          {popularSearch.map((item, index) => (
            <div className="product-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="feature-item">
          <div className="feature-icon">📦</div>
          <h4>Free Delivery</h4>
          <p>1000 mins away</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">⭐</div>
          <h4>Best Quality</h4>
          <p>Guaranted 100%</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">⏱️</div>
          <h4>1 Year</h4>
          <p>Warranty</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">💬</div>
          <h4>Feedback</h4>
          <p>We listen you</p>
        </div>
        <div className="feature-item">
          <div className="feature-icon">💳</div>
          <h4>Payment</h4>
          <p>Secure true</p>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="flash-sale">
        <div className="flash-sale__content">
          <div className="flash-sale__text">
            <h2>Flash Sale</h2>
            <div className="countdown">
              <span className="time-unit">
                <strong>05</strong>
                <small>Days</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>42</strong>
                <small>Hours</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>19</strong>
                <small>Mins</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>54</strong>
                <small>Secs</small>
              </span>
            </div>
          </div>
          <div className="flash-sale__products">
            {hotSaleProducts.slice(0, 2).map((item, index) => (
              <div className="flash-product" key={index}>
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="rating">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
                <span className="price">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="flash-sale__btn">Shop Now</button>
      </div>

      {/* Hot Sale */}
      <div className="hot-sale">
        <h2>
          <span className="hot-icon">🔥</span> Hot Sale!
        </h2>
        <div className="hot-sale__grid">
          {hotSaleProducts.map((item, index) => (
            <div className="hot-product-card" key={index}>
              {item.onSale && <span className="sale-badge">Sale</span>}
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="recently-viewed">
        <h2>Recently viewed</h2>
        <div className="recently-viewed__grid">
          {recentlyViewed.map((item, index) => (
            <div className="recent-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default HomeHero;
