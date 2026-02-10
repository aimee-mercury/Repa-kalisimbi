import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function History() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">History</h1>
        <div className="panel">
          <p>History and logs will appear here.</p>
        </div>
      </div>
    </div>
  );
}
