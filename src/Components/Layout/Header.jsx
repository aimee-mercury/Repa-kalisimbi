import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../Styles/header.scss";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  LogOut,
  Home,
  Info,
  LogIn,
  UserPlus,
  Globe,
  Truck,
  Menu,
  X,
} from "lucide-react";
import { CartContext } from "../../CartContext";
import { AuthContext } from "../../AuthContext";
import { useCurrency } from "../../CurrencyContext";
import { pushWebsiteNotification } from "../../utils/notifications";

const toSlug = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { getTotalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { currency, toggleCurrency } = useCurrency();
  const cartCount = getTotalItems();

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    window.location.replace("/");
  };

  const handleWishlistClick = () => {
    pushWebsiteNotification({
      type: "like",
      title: "Product Liked",
      message: "A product was added to your wishlist from the website.",
    });
  };

  const categoryNavItems = [
    { label: "All Categories", category: "All Categories", image: "/Images/comp.jpg" },
    { label: "Accessories", category: "Accessories", image: "/Images/comp1.jpg" },
    { label: "Smartphones", category: "Smartphones", image: "/Images/rom.jpg" },
    { label: "Laptops", category: "Laptops", image: "/Images/lap.jpg" },
    { label: "Gaming", category: "Gaming", image: "/Images/comp3.jpg" },
    { label: "TV & Media", category: "TV & Media", image: "/Images/head.jpg" },
    { label: "Headphones", category: "Headphones", image: "/Images/head.jpg" },
  ];

  const categoryPathMatch = location.pathname.match(/^\/category\/([^/]+)/);
  const categoryFromPath = categoryPathMatch?.[1]
    ? categoryNavItems.find((item) => toSlug(item.category) === categoryPathMatch[1])?.category
    : null;
  const activeCategory = categoryFromPath || location.state?.category || "All Categories";

  const goToCategory = (item) => {
    setMobileOpen(false);
    if (item.category === "All Categories") {
      navigate("/category");
      return;
    }
    navigate(`/category/${toSlug(item.category)}`, {
      state: { category: item.category, image: item.image },
    });
  };

  const handleAccountClick = () => {
    setMobileOpen(false);
    navigate(user ? "/profile" : "/login");
  };

  const handleCartClick = () => {
    setMobileOpen(false);
    navigate("/cart");
  };

  const handleSearchSubmit = () => {
    const query = searchInput.trim();
    if (!query) return;
    setMobileOpen(false);
    navigate("/category", { state: { search: query } });
  };

  return (
    <header className="header">
      <div className="header__top-bar">
        <p>
          <Truck size={14} />
          <span>Free Shipping on Orders Over $50!</span>
        </p>
        <div className="top-bar-links">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Home size={14} />
            <span>Home</span>
          </Link>
          <Link to="/category" onClick={() => setMobileOpen(false)}>
            <Info size={14} />
            <span>Shop</span>
          </Link>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <LogIn size={14} />
            <span>Login</span>
          </Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)}>
            <UserPlus size={14} />
            <span>Sign Up</span>
          </Link>
          <button type="button" className="locale-chip" onClick={toggleCurrency}>
            <Globe size={14} />
            <span>{currency === "USD" ? "EN/USD" : "EN/RWF"}</span>
          </button>
        </div>
      </div>

      <div className="header__top">
        <div className="header__logo">
          <img
            src="/Images/REPA LOGO.png"
            alt="Repa Technology Logo"
            style={{ width: "30px", height: "auto" }}
          />
          <span className="brand">Repa Technology</span>
        </div>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="header__search">
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
          />
          <button type="button" aria-label="Search" onClick={handleSearchSubmit}>
            <Search size={18} />
          </button>
        </div>

        <div className="header__actions">
          <button
            type="button"
            onClick={handleAccountClick}
            className="account-info"
            aria-label="Account"
          >
            <User size={20} />
            <div className="account-details">
              <span className="account-label">Account</span>
              <span className="account-name">{user?.email || "Login to Dashboard"}</span>
            </div>
          </button>
          <button
            type="button"
            className="wishlist-btn"
            aria-label="Wishlist"
            onClick={handleWishlistClick}
          >
            <Heart size={20} />
          </button>
          <button type="button" className="cart" onClick={handleCartClick} aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="badge">{cartCount}</span>
          </button>
          {user && (
            <button className="logout-btn" onClick={handleLogout} title="Logout" type="button">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      <nav className="header__nav">
        <ul>
          {categoryNavItems.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                className={
                  location.pathname.startsWith("/category") &&
                  item.category === activeCategory
                    ? "nav-item active-nav"
                    : "nav-item"
                }
                onClick={() => goToCategory(item)}
              >
                <img className="nav-thumb" src={item.image} alt={item.label} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {mobileOpen && (
        <button
          type="button"
          className="header__mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`header__mobile ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-top-links">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <Home size={14} />
            <span>Home</span>
          </Link>
          <Link to="/category" onClick={() => setMobileOpen(false)}>
            <Info size={14} />
            <span>Shop</span>
          </Link>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <LogIn size={14} />
            <span>Login</span>
          </Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)}>
            <UserPlus size={14} />
            <span>Sign Up</span>
          </Link>
        </div>

        <div className="mobile-actions">
          <button type="button" onClick={handleAccountClick}>
            <User size={16} />
            <span>Account</span>
          </button>
          <button type="button" onClick={handleWishlistClick}>
            <Heart size={16} />
            <span>Wishlist</span>
          </button>
          <button type="button" onClick={handleCartClick}>
            <ShoppingCart size={16} />
            <span>Cart ({cartCount})</span>
          </button>
          <button type="button" onClick={toggleCurrency}>
            <Globe size={16} />
            <span>{currency === "USD" ? "Switch to RWF" : "Switch to USD"}</span>
          </button>
        </div>

        <div className="mobile-categories">
          {categoryNavItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={
                location.pathname.startsWith("/category") &&
                item.category === activeCategory
                  ? "nav-item active-nav"
                  : "nav-item"
              }
              onClick={() => goToCategory(item)}
            >
              <img className="nav-thumb" src={item.image} alt={item.label} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </header>
  );
};

export default Header;
