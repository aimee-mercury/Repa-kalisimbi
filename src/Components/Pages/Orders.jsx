import React, { useMemo } from "react";
import { ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../../CurrencyContext";
import { readOrders } from "../../utils/orders";
import Footer from "../Layout/Footer";

export default function Orders() {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const orders = useMemo(() => readOrders(), []);

  return (
    <main className="orders-page container">
      <span className="store-eyebrow">YOUR REPA PURCHASES</span>
      <div className="orders-heading"><div><h1>Order history</h1><p>Keep track of the orders placed from this browser.</p></div><Link className="store-text-link" to="/category">Keep shopping <ArrowRight size={16} /></Link></div>
      {orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-heading"><div><span>ORDER</span><strong>{order.id}</strong></div><div><span>PLACED</span><strong>{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</strong></div><div><span>STATUS</span><strong className="order-status">{order.status}</strong></div><div><span>TOTAL</span><strong>{formatCurrency(order.total)}</strong></div></div>
              <div className="order-card-items">
                {order.items.map((item, index) => (
                  <button type="button" key={`${order.id}-${item.id}-${index}`} onClick={() => navigate("/product", { state: { product: item } })}>
                    <img src={item.image} alt="" /><span>{item.name || item.title}<small>Qty {item.quantity}</small></span><ArrowRight size={15} />
                  </button>
                ))}
              </div>
              <div className="order-card-footer"><span><PackageCheck size={16} /> Order saved locally in this browser</span><span>{order.itemCount} {order.itemCount === 1 ? "item" : "items"}</span></div>
            </article>
          ))}
        </div>
      ) : (
        <section className="orders-empty"><div><ShoppingBag size={27} /></div><h2>No orders just yet</h2><p>Your completed orders will show up here.</p><button type="button" className="store-button store-button-dark" onClick={() => navigate("/category")}>Find something you love <ArrowRight size={16} /></button></section>
      )}
      <Footer />
    </main>
  );
}
