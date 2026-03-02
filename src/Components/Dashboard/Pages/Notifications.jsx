import React, { useEffect, useMemo, useState } from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import {
  getWebsiteNotifications,
  markAllWebsiteNotificationsRead,
} from "../../../utils/notifications";
import "../../../Styles/Home.scss";
import "../../../Styles/Notifications.scss";

const formatTimeAgo = (iso) => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getGroupLabel = (iso) => {
  const date = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  if (target === today) return "Today";
  if (target === today - 86400000) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const iconForType = (type) => {
  if (type === "add_to_cart") return "CT";
  if (type === "like") return "LK";
  if (type === "contact") return "WA";
  return "NT";
};

export default function Notifications() {
  const [items, setItems] = useState(() => getWebsiteNotifications());

  useEffect(() => {
    const sync = () => setItems(getWebsiteNotifications());
    window.addEventListener("storage", sync);
    window.addEventListener("website_notifications_updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("website_notifications_updated", sync);
    };
  }, []);

  const groups = useMemo(() => {
    return items.reduce((acc, item) => {
      const label = getGroupLabel(item.createdAt);
      const target = acc.find((group) => group.label === label);
      const decorated = {
        ...item,
        icon: iconForType(item.type),
        time: formatTimeAgo(item.createdAt),
      };
      if (target) {
        target.items.push(decorated);
      } else {
        acc.push({ label, items: [decorated] });
      }
      return acc;
    }, []);
  }, [items]);

  const unreadCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.read ? 0 : 1), 0),
    [items]
  );

  const handleMarkAllRead = () => {
    markAllWebsiteNotificationsRead();
    setItems(getWebsiteNotifications());
  };

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
                You have <span>{unreadCount}</span> unread website notification(s).
              </p>
            </div>
            <button
              type="button"
              className="notifications-mark-btn"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark all as Read
            </button>
          </div>

          {groups.length === 0 ? (
            <section className="notifications-group">
              <div className="notifications-list">
                <article className="notification-card">
                  <div className="notification-main">
                    <div className="notification-copy">
                      <p className="notification-title">No notifications yet</p>
                      <p className="notification-message">
                        New cart, like, and WhatsApp contact events will appear here.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          ) : (
            groups.map((group) => (
              <section key={group.label} className="notifications-group">
                <h2>{group.label}</h2>
                <div className="notifications-list">
                  {group.items.map((item) => (
                    <article
                      key={item.id}
                      className={`notification-card ${item.read ? "read" : "unread"}`}
                    >
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
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
