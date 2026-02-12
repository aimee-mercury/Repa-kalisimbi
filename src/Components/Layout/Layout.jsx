"use client";
import React, { useContext, useMemo } from "react";
import { AuthContext } from "../../AuthContext";
import "../../Styles/layout.scss";

export default function DashboardHeader() {
  const { user } = useContext(AuthContext);
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
      {/* Left */}
      <div className="header-left">
        <h2>Repa Technology</h2>
        <p>Overview of all Repa Technology Activities.</p>
      </div>

      {/* Right */}
      <div className="header-right">
        <button className="icon-btn">✉️</button>
        <button className="icon-btn">
          🔔
          <span className="notif-dot"></span>
        </button>

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
