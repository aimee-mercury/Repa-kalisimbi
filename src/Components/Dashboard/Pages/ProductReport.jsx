import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function ProductReport() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">Product Report</h1>
        <div className="panel">
          <p>Product reports and insights will appear here.</p>
        </div>
      </div>
    </div>
  );
}
