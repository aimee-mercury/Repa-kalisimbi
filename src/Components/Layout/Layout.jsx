"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { AuthContext } from "../../AuthContext";
import "../../Styles/layout.scss";

const DASHBOARD_THEME_KEY = "dashboard_theme_mode";

export default function DashboardHeader() {
  const { user } = useContext(AuthContext);
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem(DASHBOARD_THEME_KEY);
    return saved === "dark" ? "dark" : "light";
  });
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    []
  );

  useEffect(() => {
    localStorage.setItem(DASHBOARD_THEME_KEY, themeMode);
    const isDark = themeMode === "dark";
    document.body.classList.toggle("dashboard-dark", isDark);
    return () => {
      document.body.classList.remove("dashboard-dark");
    };
  }, [themeMode]);

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

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="header-kicker">Dashboard Overview</div>
        <h2>Repa Technology Control Center</h2>
        <p>Track sales, stock, and customer activity in one responsive workspace.</p>
      </div>

      <div className="header-right">
        <div className="header-meta">
          <span className="meta-chip">{todayLabel}</span>
          <span className="meta-chip active">Store Online</span>
          <button
            type="button"
            className={`meta-action-btn theme-toggle ${themeMode === "dark" ? "is-dark" : ""}`}
            onClick={() => setThemeMode((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={themeMode === "dark" ? "Light mode" : "Dark mode"}
          >
            {themeMode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="user-info">
          {profile.avatar ? (
            <img src={profile.avatar} alt="User" />
          ) : (
            <div className="avatar-placeholder">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.email || "No email"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
