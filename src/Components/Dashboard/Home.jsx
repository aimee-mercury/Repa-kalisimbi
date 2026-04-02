import React from "react";
import DashboardHeader from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import "../../Styles/Home.scss";
import { useCurrency } from "../../CurrencyContext";

const deals = [
  {
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 5,
    image: "",
  },
  {
    name: "Bluetooth Speaker",
    price: "$39.99",
    rating: 4,
    image: "",
  },
  {
    name: "Gaming Mouse",
    price: "$29.99",
    rating: 4,
    image: "",
  },
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "",
  },
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "",
  },
];

export default function Dashboard() {
  const { formatCurrency } = useCurrency();

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />

        <h1 className="page-title">Dashboard</h1>

        <section className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">O</div>
            <div>
              <p className="stat-label">Pending Orders</p>
              <h3 className="stat-value">234</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">P</div>
            <div>
              <p className="stat-label">Total Products</p>
              <h3 className="stat-value">109</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">S</div>
            <div>
              <p className="stat-label">Total SKUs</p>
              <h3 className="stat-value">1232</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon violet">C</div>
            <div>
              <p className="stat-label">Total Customers</p>
              <h3 className="stat-value">109</h3>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">A</div>
            <div>
              <p className="stat-label">Active Coupon</p>
              <h3 className="stat-value">1232</h3>
            </div>
          </div>
        </section>

        <div className="deals">
          <h2>Best Deals</h2>
          <div className="deals__grid">
            {deals.map((item, index) => (
              <div className="deal-card" key={index}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="deal-image-placeholder">No image</div>
                )}
                <h3>{item.name}</h3>
                <div className="rating">{"?".repeat(item.rating)}{"?".repeat(5 - item.rating)}</div>
                <span className="price">{formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>
        </div>

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
                <span>{formatCurrency(1750)}</span>
                <span className="status pending">Pending</span>
              </div>
              <div className="row">
                <span>ORD1033</span>
                <span>Istak Ahmed</span>
                <span>3</span>
                <span>{formatCurrency(1322)}</span>
                <span className="status followup">Follow Up</span>
              </div>
              <div className="row">
                <span>ORD1032</span>
                <span>Khaled Sylliah</span>
                <span>5</span>
                <span>{formatCurrency(864)}</span>
                <span className="status processing">Processing</span>
              </div>
              <div className="row">
                <span>ORD1031</span>
                <span>Sabbir</span>
                <span>1</span>
                <span>{formatCurrency(1542)}</span>
                <span className="status pending">Pending</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
