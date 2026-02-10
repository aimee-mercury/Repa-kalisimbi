import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function Settings() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">Settings</h1>
        <div className="panel">
          <p>Settings page content goes here.</p>
        </div>
      </div>
    </div>
  );
}
