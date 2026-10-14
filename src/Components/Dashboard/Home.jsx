import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, CircleDollarSign, Clock3, Package, Plus, ShoppingBag, Sparkles, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { useCurrency } from "../../CurrencyContext";
import { readOrders } from "../../utils/orders";
import "../../Styles/Home.scss";

const readProducts = () => {
  try {
    const data = JSON.parse(localStorage.getItem("dashboardProducts") || "[]");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Unable to read dashboard products:", error);
    return [];
  }
};

const isPending = (order) => !["completed", "delivered", "cancelled"].includes(String(order.status || "").toLowerCase());

const weekDays = () => Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - 6 + index);
  date.setHours(0, 0, 0, 0);
  return date;
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState(readProducts);
  const [orders, setOrders] = useState(readOrders);

  const syncStore = useCallback(() => {
    setProducts(readProducts());
    setOrders(readOrders());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncStore);
    window.addEventListener("focus", syncStore);
    return () => {
      window.removeEventListener("storage", syncStore);
      window.removeEventListener("focus", syncStore);
    };
  }, [syncStore]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + Number(order.total || 0), 0);
    const stock = products.reduce((total, product) => total + Math.max(0, Number(product.stock || 0)), 0);
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock) <= 5).length;
    return {
      products: products.length,
      stock,
      orders: orders.length,
      pending: orders.filter(isPending).length,
      revenue,
      lowStock,
    };
  }, [orders, products]);

  const revenueWeek = useMemo(() => {
    const days = weekDays();
    const totals = days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      return orders.reduce((total, order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= day && orderDate < nextDay ? total + Number(order.total || 0) : total;
      }, 0);
    });
    const max = Math.max(...totals, 1);
    return days.map((date, index) => ({
      label: date.toLocaleDateString("en", { weekday: "short" }),
      value: totals[index],
      height: Math.max(4, (totals[index] / max) * 100),
    }));
  }, [orders]);

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5).slice(0, 4);

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <main className="admin-overview">
          <div className="admin-page-heading">
            <div><span className="admin-eyebrow">YOUR STORE AT A GLANCE</span><h1>Dashboard</h1><p>A clear view of today&apos;s products, orders, and store activity.</p></div>
            <button type="button" className="admin-primary-button" onClick={() => navigate("/dashboard/products/add")}><Plus size={17} /> Add a product</button>
          </div>

          <section className="admin-metrics" aria-label="Store metrics">
            <article className="admin-metric-card"><span className="admin-metric-icon sage"><Boxes size={19} /></span><div><span>Products</span><strong>{stats.products}</strong><small>In your inventory</small></div><Link to="/dashboard/products/new" aria-label="Open products"><ArrowUpRight size={16} /></Link></article>
            <article className="admin-metric-card"><span className="admin-metric-icon blue"><Package size={19} /></span><div><span>Units in stock</span><strong>{stats.stock}</strong><small>{stats.lowStock} need attention</small></div><Link to="/dashboard/products/report" aria-label="Open stock report"><ArrowUpRight size={16} /></Link></article>
            <article className="admin-metric-card"><span className="admin-metric-icon gold"><ShoppingBag size={19} /></span><div><span>Orders</span><strong>{stats.orders}</strong><small>{stats.pending} in progress</small></div><Link to="/orders" aria-label="View order history"><ArrowUpRight size={16} /></Link></article>
            <article className="admin-metric-card"><span className="admin-metric-icon lavender"><CircleDollarSign size={19} /></span><div><span>Recorded revenue</span><strong>{formatCurrency(stats.revenue)}</strong><small>From completed checkouts</small></div><TrendingUp size={17} className="admin-metric-trend" /></article>
          </section>

          <section className="admin-overview-grid">
            <article className="admin-panel admin-revenue-panel">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">LAST 7 DAYS</span><h2>Order revenue</h2><p>Based on orders recorded in this store.</p></div><span className="admin-chart-total">{formatCurrency(revenueWeek.reduce((sum, day) => sum + day.value, 0))}</span></div>
              <div className="admin-chart" role="img" aria-label="Daily revenue over the last seven days">
                {revenueWeek.map((day) => <div className="admin-chart-day" key={day.label}><span title={formatCurrency(day.value)} style={{ height: `${day.height}%` }} /><small>{day.label}</small></div>)}
              </div>
              {!orders.length && <div className="admin-chart-empty"><Sparkles size={15} /> Your sales activity will appear here after your first checkout.</div>}
            </article>

            <article className="admin-panel admin-shortcuts">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">KEEP THINGS MOVING</span><h2>Quick actions</h2></div></div>
              <Link to="/dashboard/products/add"><span className="shortcut-icon"><Plus size={17} /></span><span><strong>Add new product</strong><small>List something in your store</small></span><ArrowRight size={16} /></Link>
              <Link to="/dashboard/products/drafts"><span className="shortcut-icon"><Clock3 size={17} /></span><span><strong>Continue a draft</strong><small>Pick up where you left off</small></span><ArrowRight size={16} /></Link>
              <Link to="/dashboard/products/report"><span className="shortcut-icon"><TrendingUp size={17} /></span><span><strong>View inventory report</strong><small>Review stock and performance</small></span><ArrowRight size={16} /></Link>
            </article>
          </section>

          <section className="admin-overview-grid lower">
            <article className="admin-panel admin-recent-orders">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">THE LATEST</span><h2>Recent orders</h2><p>Orders placed by your customers.</p></div><Link to="/orders" className="admin-inline-link">View all <ArrowRight size={14} /></Link></div>
              {recentOrders.length ? <div className="admin-order-list">
                {recentOrders.map((order) => <div className="admin-order-row" key={order.id}><span className="admin-order-avatar">{String(order.customer || "G").charAt(0).toUpperCase()}</span><span className="admin-order-name"><strong>{order.customer || "Guest"}</strong><small>{order.id} · {Number(order.itemCount || 0)} {Number(order.itemCount) === 1 ? "item" : "items"}</small></span><strong className="admin-order-total">{formatCurrency(order.total)}</strong><span className={`admin-order-status ${isPending(order) ? "pending" : "complete"}`}>{order.status || "Processing"}</span></div>)}
              </div> : <div className="admin-empty-state"><ShoppingBag size={21} /><strong>No orders yet</strong><span>Completed checkouts will show here.</span><Link to="/category">Explore the storefront <ArrowRight size={14} /></Link></div>}
            </article>

            <article className="admin-panel admin-stock-panel">
              <div className="admin-panel-heading"><div><span className="admin-eyebrow">INVENTORY HEALTH</span><h2>Stock watch</h2><p>Products with five or fewer units.</p></div><Link to="/dashboard/products/report" className="admin-inline-link">See report <ArrowRight size={14} /></Link></div>
              {lowStockProducts.length ? <div className="admin-stock-list">{lowStockProducts.map((product) => <div key={product.id}><img src={product.image || product.images?.[0] || "/Images/lap.jpg"} alt="" /><span><strong>{product.name || "Untitled product"}</strong><small>{product.category || "Uncategorized"}</small></span><span className={Number(product.stock || 0) === 0 ? "out-of-stock" : "low-stock"}>{Number(product.stock || 0) === 0 ? "Out" : `${product.stock} left`}</span></div>)}</div> : <div className="admin-empty-state"><Package size={21} /><strong>Looking good</strong><span>No low-stock products to flag.</span><Link to="/dashboard/products/add">Add inventory <ArrowRight size={14} /></Link></div>}
            </article>
          </section>

          {products.length === 0 && <section className="admin-welcome-callout"><span><ArrowDownRight size={20} /></span><div><strong>Start with your first product</strong><p>Add a product to build your inventory. Save an unfinished listing as a draft whenever you need.</p></div><Link to="/dashboard/products/add">Create a listing <ArrowRight size={15} /></Link></section>}
        </main>
      </div>
    </div>
  );
}
