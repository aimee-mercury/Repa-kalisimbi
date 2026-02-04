import React from "react";
import "../../Styles/header.scss";
import { Search, User, Heart, ShoppingCart } from "lucide-react";

const Header = () => {
  return (
    <header className="header">
      {/* Top Bar */}
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
          <button>
            <User size={20} />
            <span>Account</span>
          </button>
          <button>
            <Heart size={20} />
          </button>
          <button className="cart">
            <ShoppingCart size={20} />
            <span className="badge">2</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header__nav">
        <ul>
          <li>All Categories</li>
          <li>Accessories</li>
          <li>Smartphones</li>
          <li>Laptops</li>
          <li>Gaming</li>
          <li>TV & Media</li>
          <li>Headphones</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
