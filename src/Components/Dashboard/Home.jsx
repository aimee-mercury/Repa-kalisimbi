import React from "react";
import DashboardHeader from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import "../../Styles/Home.scss";

const deals = [
  {
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Bluetooth Speaker",
    price: "$39.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Gaming Mouse",
    price: "$29.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
];

export default function Dashboard() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />

        <h1 className="page-title">Dashboard</h1>

        {/* STATS */}
        <section className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div>
              <p className="stat-label">Pending Orders</p>
              <h3 className="stat-value">234</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🧩</div>
            <div>
              <p className="stat-label">Total Products</p>
              <h3 className="stat-value">109</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">🏷️</div>
            <div>
              <p className="stat-label">Total SKUs</p>
              <h3 className="stat-value">1232</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon violet">👥</div>
            <div>
              <p className="stat-label">Total Customers</p>
              <h3 className="stat-value">109</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">🏷️</div>
            <div>
              <p className="stat-label">Active Coupon</p>
              <h3 className="stat-value">1232</h3>
            </div>
          </div>
        </section>

        {/* BEST DEALS */}
        <div className="deals">
          <h2>Best Deals</h2>
          <div className="deals__grid">
            {deals.map((item, index) => (
              <div className="deal-card" key={index}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <div className="rating">
                  {"★".repeat(item.rating)}
                  {"☆".repeat(5 - item.rating)}
                </div>
                <span className="price">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM GRID */}
        <section className="dashboard-grid bottom">
          <div className="panel recent-orders">
            <div className="panel-header">
              <h3>Recent Orders</h3>
              <button className="ghost-btn">See All</button>
            </div>
            <div className="orders-table">
              <div className="row header">
                <span>Order</span>
                <span>Customer</span>
                <span>Items</span>
                <span>Total</span>
                <span>Status</span>
              </div>
              <div className="row">
                <span>ORD1034</span>
                <span>Asif Mahmud</span>
                <span>2</span>
                <span>৳1750</span>
                <span className="status pending">Pending</span>
              </div>
              <div className="row">
                <span>ORD1033</span>
                <span>Istak Ahmed</span>
                <span>3</span>
                <span>$1322</span>
                <span className="status followup">Follow Up</span>
              </div>
              <div className="row">
                <span>ORD1032</span>
                <span>Khaled Sylliah</span>
                <span>5</span>
                <span>$864</span>
                <span className="status processing">Processing</span>
              </div>
              <div className="row">
                <span>ORD1031</span>
                <span>Sabbir</span>
                <span>1</span>
                <span>$1542</span>
                <span className="status pending">Pending</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
