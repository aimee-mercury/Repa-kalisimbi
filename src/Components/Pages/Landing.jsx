import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/Landing.scss";
import Footer from "../Layout/Footer";
import { useCurrency } from "../../CurrencyContext";

const heroSlides = [
  {
    tag: "Featured Device",
    title: "Apple Watch Series 9",
    version: "Version: GPS 45mm",
    description:
      "Powerful health tracking, bright display, and seamless iPhone integration for everyday performance.",
    price: "$429.00",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Top Pick",
    title: "Sony WH-1000XM5",
    version: "Version: XM5 Wireless",
    description:
      "Industry-leading noise cancellation with premium comfort, battery life, and studio-grade sound quality.",
    price: "$399.00",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "New Arrival",
    title: "Samsung Galaxy S24 Ultra",
    version: "Version: 12GB / 256GB",
    description:
      "Flagship AI smartphone with premium camera system, fast performance, and all-day battery reliability.",
    price: "$1,299.00",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Pro Laptop",
    title: "MacBook Pro 14",
    version: "Version: M3 / 16GB / 512GB",
    description:
      "High-performance laptop built for creative workflows, development, and long battery life.",
    price: "$1,999.00",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Gaming Power",
    title: "ASUS ROG Zephyrus G14",
    version: "Version: Ryzen 9 / RTX 4060",
    description:
      "Portable gaming machine with high refresh display and strong thermal performance.",
    price: "$1,599.00",
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Audio Premium",
    title: "AirPods Pro 2nd Gen",
    version: "Version: USB-C Charging Case",
    description:
      "Compact earbuds with active noise cancellation and adaptive transparency mode.",
    price: "$249.00",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Home Entertainment",
    title: "LG OLED evo C3",
    version: "Version: 55-inch 4K",
    description:
      "Cinema-level color and contrast with smart TV features and smooth gaming visuals.",
    price: "$1,299.00",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Creator Gear",
    title: "Sony Alpha A7 IV",
    version: "Version: 33MP Mirrorless",
    description:
      "Professional camera for crisp photos, advanced autofocus, and 4K video output.",
    price: "$2,499.00",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Work Setup",
    title: "Dell UltraSharp Monitor",
    version: "Version: 27-inch QHD",
    description:
      "Color-accurate display designed for productivity, editing, and multi-window work.",
    price: "$479.00",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4d1b0f7d6dc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Smart Home",
    title: "Amazon Echo Show 8",
    version: "Version: 3rd Generation",
    description:
      "Voice-controlled smart display for video calls, music, reminders, and home control.",
    price: "$149.00",
    image:
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Mobile Flagship",
    title: "Google Pixel 8 Pro",
    version: "Version: 12GB / 128GB",
    description:
      "AI-powered smartphone with a premium camera system and smooth Android experience.",
    price: "$899.00",
    image:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Portable Audio",
    title: "JBL Charge 5",
    version: "Version: Bluetooth Waterproof",
    description:
      "Rugged wireless speaker with powerful bass and long battery for outdoor use.",
    price: "$179.00",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    tag: "Productivity Pick",
    title: "iPad Air",
    version: "Version: M2 / 256GB",
    description:
      "Lightweight tablet for study, design, note-taking, and media with strong performance.",
    price: "$749.00",
    image:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1200&q=80",
  },
];

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

const LANDING_PRODUCTS_KEY = "landingPostedProducts";
const FLASH_SALE_END_KEY = "landingFlashSaleEndAt";
const FLASH_SALE_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SECTION_NAMES = [
  "Best Deals",
  "Top !o Selected",
  "Popular Search",
  "Hot Sale",
  "Recently",
];

const toLandingCard = (product = {}) => ({
  id: product.id || `landing-${product.name || "product"}`,
  name: product.name || "New Product",
  price: `$${Number(product.price || 0).toFixed(2)}`,
  rating: Number(product.rating || 5),
  image: product.image || "/Images/lap.jpg",
  onSale: (product.sourceSection || "").toLowerCase() === "hot sale",
});

const HomeHero = () => {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const topProductsGridRef = React.useRef(null);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [flashRemaining, setFlashRemaining] = React.useState(null);
  const [postedBySection, setPostedBySection] = React.useState(() =>
    SECTION_NAMES.reduce((acc, sectionName) => {
      acc[sectionName] = [];
      return acc;
    }, {})
  );

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    const storedEnd = Number(localStorage.getItem(FLASH_SALE_END_KEY));
    const flashSaleEndAt =
      Number.isFinite(storedEnd) && storedEnd > 0
        ? storedEnd
        : Date.now() + FLASH_SALE_DURATION_MS;

    if (!storedEnd) {
      localStorage.setItem(FLASH_SALE_END_KEY, String(flashSaleEndAt));
    }

    const tick = () => {
      const diff = flashSaleEndAt - Date.now();
      if (diff <= 0) {
        setFlashRemaining(null);
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const secs = Math.floor((diff % (60 * 1000)) / 1000);

      setFlashRemaining({ days, hours, mins, secs });
    };

    tick();
    const countdown = window.setInterval(tick, 1000);
    return () => window.clearInterval(countdown);
  }, []);

  const currentHero = heroSlides[activeSlide];

  React.useEffect(() => {
    const syncPostedProducts = () => {
      const initial = SECTION_NAMES.reduce((acc, sectionName) => {
        acc[sectionName] = [];
        return acc;
      }, {});

      try {
        const postedProducts = JSON.parse(
          localStorage.getItem(LANDING_PRODUCTS_KEY) || "[]"
        );

        const nextPostedProducts = postedProducts
          .filter((product) => Number(product.stock ?? 1) > 0)
          .reduce((acc, product) => {
            const sectionName = SECTION_NAMES.includes(product.sourceSection)
              ? product.sourceSection
              : "Best Deals";
            acc[sectionName].push(toLandingCard(product));
            return acc;
          }, initial);

        setPostedBySection(nextPostedProducts);
      } catch {
        setPostedBySection(initial);
      }
    };

    syncPostedProducts();
    window.addEventListener("storage", syncPostedProducts);
    window.addEventListener("focus", syncPostedProducts);
    return () => {
      window.removeEventListener("storage", syncPostedProducts);
      window.removeEventListener("focus", syncPostedProducts);
    };
  }, []);

  const dealsItems = [...postedBySection["Best Deals"], ...deals];
  const topSelectedItems = [...postedBySection["Top !o Selected"], ...topProducts];
  const popularSearchItems = [...postedBySection["Popular Search"], ...popularSearch];
  const hotSaleItems = [...postedBySection["Hot Sale"], ...hotSaleProducts];
  const recentlyItems = [...postedBySection.Recently, ...recentlyViewed];

  const scrollTopProducts = (direction) => {
    if (topProductsGridRef.current) {
      const scrollAmount = 220;
      topProductsGridRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (product) => {
    navigate("/product", { state: { product } });
  };

  const openProductDetails = (product) => {
    navigate("/product", { state: { product } });
  };

  const handleCardKeyDown = (event, product) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductDetails(product);
    }
  };

  const pad2 = (value) => String(value).padStart(2, "0");

  return (
    <section className="home">
      {/* Hero Banner */}
      <section className="hero container">
        <div className="hero-text">
          <small>{currentHero.tag}</small>
          <h1>{currentHero.title}</h1>
          <p className="hero-version">{currentHero.version}</p>
          <p className="hero-description">{currentHero.description}</p>
          <p>
            Start from <strong>{formatCurrency(currentHero.price)}</strong>
          </p>
          <div className="hero-actions">
            <button
              type="button"
              onClick={() =>
                handleAddToCart({
                  name: currentHero.title,
                  price: currentHero.price,
                  rating: 5,
                  image: currentHero.image,
                })
              }
            >
              Shop Now
            </button>
            <button
              type="button"
              className="hero-outline-btn"
              onClick={() => navigate("/category")}
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image-wrap">
          <img src={currentHero.image} alt={currentHero.title} />
        </div>
      </section>

      {/* Best Deals */}
      <div className="deals">
        <h2>Best Deals</h2>

        <div className="deals__grid">
          {dealsItems.map((item, index) => (
            <div
              className="deal-card clickable-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(item)}
              onKeyDown={(event) => handleCardKeyDown(event, item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 10 Selected Products */}
      <div className="top-products">
        <div className="top-products-header">
          <h2>Top 10 Selected Products of the Week</h2>
          <div className="top-products-arrows">
            <button onClick={() => scrollTopProducts("left")}>‹</button>
            <button onClick={() => scrollTopProducts("right")}>›</button>
          </div>
        </div>
        <div className="top-products__grid" ref={topProductsGridRef}>
          {topSelectedItems.map((item, index) => (
            <div
              className="top-product-card clickable-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(item)}
              onKeyDown={(event) => handleCardKeyDown(event, item)}
            >
              <span className="top-rank">#{String(index + 1).padStart(2, "0")}</span>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Search */}
      <div className="popular-search">
        <h2>Popular Search</h2>
        <div className="popular-search__grid">
          {popularSearchItems.map((item, index) => (
            <div
              className="product-card clickable-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(item)}
              onKeyDown={(event) => handleCardKeyDown(event, item)}
            >
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="features">
        <div className="features-head">
          <h2>Why customers choose Repa Technology</h2>
        </div>
        <div className="features-grid">
          <article className="feature-card">
            <span className="feature-badge">24H</span>
            <h4>Same-Day Dispatch</h4>
            <p>Orders confirmed before 2 PM are prepared and shipped the same day.</p>
          </article>
          <article className="feature-card">
            <span className="feature-badge">QC</span>
            <h4>Verified Quality</h4>
            <p>Each device is tested and checked before reaching your hands.</p>
          </article>
          <article className="feature-card">
            <span className="feature-badge">1Y</span>
            <h4>1 Year Warranty</h4>
            <p>Clear warranty support with fast replacement on eligible products.</p>
          </article>
          <article className="feature-card">
            <span className="feature-badge">SUP</span>
            <h4>Real Support Team</h4>
            <p>Need help choosing or tracking an order? We answer quickly.</p>
          </article>
          <article className="feature-card">
            <span className="feature-badge">SEC</span>
            <h4>Secure Checkout</h4>
            <p>Protected payment flow with trusted processing and safe records.</p>
          </article>
        </div>
      </section>

      {/* Flash Sale */}
      {flashRemaining && <div className="flash-sale">
        <div className="flash-sale__content">
          <div className="flash-sale__text">
            <h2>Flash Sale</h2>
            <div className="countdown">
              <span className="time-unit">
                <strong>{pad2(flashRemaining.days)}</strong>
                <small>Days</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>{pad2(flashRemaining.hours)}</strong>
                <small>Hours</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>{pad2(flashRemaining.mins)}</strong>
                <small>Mins</small>
              </span>
              <span className="separator">:</span>
              <span className="time-unit">
                <strong>{pad2(flashRemaining.secs)}</strong>
                <small>Secs</small>
              </span>
            </div>
          </div>
          <div className="flash-sale__products">
            {hotSaleItems.slice(0, 2).map((item, index) => (
              <div
                className="flash-product clickable-card"
                key={index}
                role="button"
                tabIndex={0}
                onClick={() => openProductDetails(item)}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
              >
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <div className="rating">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
                <span className="price">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="flash-sale__btn">Shop Now</button>
      </div>}

      {/* Hot Sale */}
      <div className="hot-sale">
        <h2>
          <span className="hot-icon">🔥</span> Hot Sale!
        </h2>
        <div className="hot-sale__grid">
          {hotSaleItems.map((item, index) => (
            <div
              className="hot-product-card clickable-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(item)}
              onKeyDown={(event) => handleCardKeyDown(event, item)}
            >
              {item.onSale && <span className="sale-badge">Sale</span>}
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{formatCurrency(item.price)}</span>
              <button 
                className="add-to-cart"
                onClick={(event) => {
                  event.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Viewed */}
      <div className="recently-viewed">
        <h2>Recently viewed</h2>
        <div className="recently-viewed__grid">
          {recentlyItems.map((item, index) => (
            <div
              className="recent-card clickable-card"
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => openProductDetails(item)}
              onKeyDown={(event) => handleCardKeyDown(event, item)}
            >
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default HomeHero;
