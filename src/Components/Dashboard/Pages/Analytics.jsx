import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function Analytics() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">Analytics</h1>
        <div className="panel">
          <p>Analytics dashboard content goes here.</p>
        </div>
      </div>
    </div>
  );
}
