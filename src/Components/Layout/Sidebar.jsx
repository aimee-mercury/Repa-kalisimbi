"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { AuthContext } from "../../AuthContext";
import { getWebsiteUnreadCount } from "../../utils/notifications";
import "../../Styles/Sidebar.scss";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const isProductsActive = useMemo(
    () => location.pathname.startsWith("/dashboard/products"),
    [location.pathname]
  );

  const [productsOpen, setProductsOpen] = useState(isProductsActive);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(() =>
    getWebsiteUnreadCount()
  );
  const showProductsOpen = productsOpen || isProductsActive;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncUnread = () => setUnreadNotifications(getWebsiteUnreadCount());
    window.addEventListener("storage", syncUnread);
    window.addEventListener("website_notifications_updated", syncUnread);
    return () => {
      window.removeEventListener("storage", syncUnread);
      window.removeEventListener("website_notifications_updated", syncUnread);
    };
  }, []);

  const profile = useMemo(() => {
    const savedSettings = JSON.parse(localStorage.getItem("settingsProfile") || "{}");
    const fullName = `${savedSettings.firstName || ""} ${savedSettings.lastName || ""}`.trim();
    const avatar =
      user?.avatar ||
      (savedSettings.avatar && !String(savedSettings.avatar).includes("/Images/profile.jpg")
        ? savedSettings.avatar
        : "");

    return {
      name: fullName || user?.name || "User",
      email: user?.email || savedSettings.email || "",
      avatar,
    };
  }, [user]);

  const go = (path) => () => {
    setMobileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    window.location.replace("/");
  };

  return (
    <>
      <button
        type="button"
        className={`sidebar-toggle ${mobileOpen ? "open" : ""}`}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        Menu
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <img
            src="/Images/REPA LOGO.png"
            alt="Repa Technology Logo"
            style={{ width: "30px", height: "auto" }}
          />
          <span>Repa Technology</span>
        </div>

        <nav className="sidebar-menu">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            onClick={go("/dashboard")}
          />

          <button
            type="button"
            className={`sidebar-item ${isProductsActive ? "active" : ""}`}
            onClick={() => setProductsOpen((v) => !v)}
          >
            <span className="icon">
              <Boxes size={18} />
            </span>
            <span className="label">Products</span>
            <span className={`arrow ${showProductsOpen ? "open" : ""}`}>v</span>
          </button>

          <div className={`sidebar-submenu ${showProductsOpen ? "open" : ""}`}>
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
            icon={<Bell size={18} />}
            label="Notifications"
            badge={unreadNotifications > 0 ? String(unreadNotifications) : ""}
            active={location.pathname === "/dashboard/notifications"}
            onClick={go("/dashboard/notifications")}
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            active={location.pathname === "/dashboard/settings"}
            onClick={go("/dashboard/settings")}
          />
          <SidebarItem icon={<LogOut size={18} />} label="Logout" onClick={handleLogout} />
        </nav>

        <div className="sidebar-user">
          {profile.avatar ? (
            <img src={profile.avatar} alt="User" />
          ) : (
            <div className="avatar-placeholder">{profile.name.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.email || "No email"}</span>
          </div>
        </div>
      </aside>
    </>
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
