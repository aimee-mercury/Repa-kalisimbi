import React, { useContext } from "react";
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
  LayoutGrid,
  Cable,
  Smartphone,
  Laptop,
  Gamepad2,
  Tv2,
  Headphones,
} from "lucide-react";
import { CartContext } from "../../CartContext";
import { AuthContext } from "../../AuthContext";
import { useCurrency } from "../../CurrencyContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const { currency, toggleCurrency } = useCurrency();
  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    window.location.replace("/");
  };

  const categoryNavItems = [
    { label: "All Categories", category: "All Categories", image: "/Images/comp.jpg", icon: LayoutGrid },
    { label: "Accessories", category: "Accessories", image: "/Images/comp1.jpg", icon: Cable },
    { label: "Smartphones", category: "Smartphones", image: "/Images/rom.jpg", icon: Smartphone },
    { label: "Laptops", category: "Laptops", image: "/Images/lap.jpg", icon: Laptop },
    { label: "Gaming", category: "Gaming", image: "/Images/comp3.jpg", icon: Gamepad2 },
    { label: "TV & Media", category: "TV & Media", image: "/Images/head.jpg", icon: Tv2 },
    { label: "Headphones", category: "Headphones", image: "/Images/head.jpg", icon: Headphones },
  ];

  const goToCategory = (item) => {
    if (item.category === "All Categories") {
      navigate("/category");
      return;
    }
    navigate("/category", { state: { category: item.category, image: item.image } });
  };

  return (
    <header className="header">
      <div className="header__top-bar">
        <p>
          <Truck size={14} />
          <span>Free Shipping on Orders Over $50!</span>
        </p>
        <div className="top-bar-links">
          <Link to="/">
            <Home size={14} />
            <span>Home</span>
          </Link>
          <Link to="/category">
            <Info size={14} />
            <span>About</span>
          </Link>
          <Link to="/login">
            <LogIn size={14} />
            <span>Login</span>
          </Link>
          <Link to="/signup">
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

        <div className="header__search">
          <input type="text" placeholder="Search items..." />
          <button type="button" aria-label="Search">
            <Search size={18} />
          </button>
        </div>

        <div className="header__actions">
          <button
            type="button"
            onClick={() => navigate(user ? "/profile" : "/login")}
            className="account-info"
            aria-label="Account"
          >
            <User size={20} />
            <div className="account-details">
              <span className="account-label">Account</span>
              <span className="account-name">{user?.email || "Login to Dashboard"}</span>
            </div>
          </button>
          <button type="button" className="wishlist-btn" aria-label="Wishlist">
            <Heart size={20} />
          </button>
          <button type="button" className="cart" onClick={() => navigate("/cart")} aria-label="Cart">
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
                  location.pathname === "/category" &&
                  item.category === (location.state?.category || "All Categories")
                    ? "nav-item active-nav"
                    : "nav-item"
                }
                onClick={() => goToCategory(item)}
              >
                <item.icon size={15} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
