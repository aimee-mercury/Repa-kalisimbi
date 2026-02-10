"use client";
import React from "react";
import "../../Styles/layout.scss";

export default function DashboardHeader() {
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
          <img
            src="https://i.pravatar.cc/40?img=13"
            alt="User"
          />
          <div>
            <strong>Daniel Smith</strong>
            <span>Sale Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
