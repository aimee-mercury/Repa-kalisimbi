"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import "../../Styles/Sidebar.scss";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [productsOpen, setProductsOpen] = useState(false);

  const isProductsActive = useMemo(
    () => location.pathname.startsWith("/dashboard/products"),
    [location.pathname]
  );

  useEffect(() => {
    if (isProductsActive) {
      setProductsOpen(true);
    }
  }, [isProductsActive]);

  const go = (path) => () => navigate(path);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">▼</div>
        <span>Repa Technology</span>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        <SidebarItem
          icon="⬜"
          label="Dashboard"
          active={location.pathname === "/dashboard"}
          onClick={go("/dashboard")}
        />

        <button
          type="button"
          className={`sidebar-item ${isProductsActive ? "active" : ""}`}
          onClick={() => setProductsOpen((v) => !v)}
        >
          <span className="icon">📦</span>
          <span className="label">Products</span>
          <span className={`arrow ${productsOpen ? "open" : ""}`}>⌄</span>
        </button>
        <div className={`sidebar-submenu ${productsOpen ? "open" : ""}`}>
          <SidebarSubItem
            label="New Product"
            active={location.pathname === "/dashboard/products/new"}
            onClick={go("/dashboard/products/new")}
          />
          <SidebarSubItem
            label="Add Product"
            active={location.pathname === "/dashboard/products/add"}
            onClick={go("/dashboard/products/add")}
          />
          <SidebarSubItem
            label="Report"
            active={location.pathname === "/dashboard/products/report"}
            onClick={go("/dashboard/products/report")}
          />
        </div>

        <SidebarItem
          icon="📈"
          label="Analytics"
          active={location.pathname === "/dashboard/analytics"}
          onClick={go("/dashboard/analytics")}
        />
        <SidebarItem
          icon="🕘"
          label="History"
          active={location.pathname === "/dashboard/history"}
          onClick={go("/dashboard/history")}
        />
        <SidebarItem
          icon="🔔"
          label="Notifications"
          badge="2"
          active={location.pathname === "/dashboard/notifications"}
          onClick={go("/dashboard/notifications")}
        />
        <SidebarItem
          icon="⚙️"
          label="Settings"
          active={location.pathname === "/dashboard/settings"}
          onClick={go("/dashboard/settings")}
        />
        <SidebarItem icon="➡️" label="Logout" onClick={handleLogout} />
      </nav>

      {/* User */}
      <div className="sidebar-user">
        <img src="https://i.pravatar.cc/40" alt="User" />
        <div>
          <strong>Michael Smith</strong>
          <span>michaelsmith12@gmail.com</span>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, badge, active, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
      {badge && <span className="badge">{badge}</span>}
    </button>
  );
}

function SidebarSubItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`sidebar-subitem ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="dot"></span>
      <span className="label">{label}</span>
    </button>
  );
}
