import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";

export default function Notifications() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <h1 className="page-title">Notifications</h1>
        <div className="panel">
          <p>Notification settings and alerts go here.</p>
        </div>
      </div>
    </div>
  );
}
