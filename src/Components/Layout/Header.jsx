import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/header.scss";
import { Search, User, Heart, ShoppingCart, LogOut } from "lucide-react";
import { CartContext } from "../../CartContext";
import { AuthContext } from "../../AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <div>
        <div className="header__top-bar">
          <p>Free Shipping on Orders Over $50!</p>
          <div className="top-bar-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
            <a href="#">About</a>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              Login
            </a>
            <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Sign Up
            </a>
            <a href="#">EN/USD</a>
          </div>
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
          <button>
            <Search size={18} />
          </button>
        </div>

        <div className="header__actions">
          <button onClick={() => navigate(user ? '/profile' : '/login')} className="account-info">
            <User size={20} />
            <div className="account-details">
              <span className="account-label">Account</span>
              <span className="account-name">{user?.email || 'Login to Dashboard'}</span>
            </div>
          </button>
          <button className="wishlist-btn">
            <Heart size={20} />
          </button>
          <button className="cart" onClick={() => navigate('/cart')}>
            <ShoppingCart size={20} />
            <span className="badge">{cartCount}</span>
          </button>
          {user && (
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="header__nav">
        <ul>
          <li onClick={() => navigate('/category')} style={{ cursor: 'pointer' }}>All Categories</li>
          <li>Accessories</li>
          <li>Smartphones</li>
          <li onClick={() => navigate('/category', { state: { category: 'LAPTOP', image: '/Images/lap.jpg' } })} style={{ cursor: 'pointer' }}>Laptops</li>
          <li>Gaming</li>
          <li>TV & Media</li>
          <li>Headphones</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
