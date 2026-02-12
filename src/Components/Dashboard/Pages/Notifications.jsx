import React from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";
import "../../../Styles/Notifications.scss";

const notificationGroups = [
  {
    label: "Today",
    items: [
      {
        id: 1,
        icon: "LS",
        title: "Low Stock Alert: iPhone 15 Pro",
        time: "1h ago",
        message:
          "Inventory dropped to 4 units. Reorder is recommended to avoid stockout during evening traffic.",
      },
      {
        id: 2,
        icon: "OK",
        title: "Order #RP-4891 Paid Successfully",
        time: "2h ago",
        message:
          "Customer payment was confirmed and the order is ready for warehouse packing.",
      },
      {
        id: 3,
        icon: "DL",
        title: "Shipment Delayed: Kigali Zone",
        time: "4h ago",
        message:
          "Courier partner reported a delivery delay for 3 electronics orders due to route congestion.",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: 4,
        icon: "RT",
        title: "Return Request Received",
        time: "Yesterday",
        message:
          "A customer requested a return for Samsung Galaxy Buds 2. Awaiting admin approval.",
      },
      {
        id: 5,
        icon: "TM",
        title: "New Staff Access Added",
        time: "Yesterday",
        message:
          "A support manager account was added and granted access to orders and customer tickets.",
      },
    ],
  },
  {
    label: "30 Jun",
    items: [
      {
        id: 6,
        icon: "UP",
        title: "Weekly Sales Milestone Reached",
        time: "30 Jun",
        message:
          "Electronics store revenue increased by 18% this week, led by laptops and smartphone sales.",
      },
    ],
  },
];

export default function Notifications() {
  const notificationsCount = notificationGroups.reduce(
    (total, group) => total + group.items.length,
    0
  );

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="notifications-page">
          <div className="notifications-head">
            <div>
              <h1 className="notifications-title">Notifications</h1>
              <p className="notifications-subtitle">
                You have <span>{notificationsCount}</span> notifications to go through.
              </p>
            </div>
            <button type="button" className="notifications-mark-btn">
              Mark all as Read
            </button>
          </div>

          {notificationGroups.map((group) => (
            <section key={group.label} className="notifications-group">
              <h2>{group.label}</h2>
              <div className="notifications-list">
                {group.items.map((item) => (
                  <article key={item.id} className="notification-card">
                    <div className="notification-main">
                      <div className="notification-icon" aria-hidden="true">
                        <span>{item.icon}</span>
                      </div>
                      <div className="notification-copy">
                        <p className="notification-title">
                          {item.title} <span>{item.time}</span>
                        </p>
                        <p className="notification-message">{item.message}</p>
                      </div>
                    </div>
                    <button type="button" className="notification-view">
                      View
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
