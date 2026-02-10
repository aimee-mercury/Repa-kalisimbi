import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function NewProduct() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">New Product</h1>
        <div className="panel">
          <p>Create a new product here.</p>
        </div>
      </div>
    </div>
  );
}
