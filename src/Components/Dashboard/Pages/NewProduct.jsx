import React, { useMemo, useState } from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import { useCurrency } from "../../../CurrencyContext";
import "../../../Styles/Home.scss";
import "../../../Styles/NewProduct.scss";

const fallbackProducts = [
  {
    id: "seed-1",
    name: "AAAZU 12X SSD Hi Tech Fan Cooling Ultra",
    description:
      "Direct Full Away, Ambient Mode. One remote control, quantum dot technology.",
    image: "/Images/lap.jpg",
    sku: "SKU 1231452485251",
    oldPrice: 533.5,
    price: 412.23,
    status: "IN STOCK",
    stock: 17,
  },
  {
    id: "seed-2",
    name: "Makbook Pro 2020 With 260 SSD",
    description:
      "Direct Full Away, Ambient Mode. One remote control, quantum dot technology.",
    image: "/Images/comp.jpg",
    sku: "SKU 1231452485251",
    oldPrice: 633.3,
    price: 546.87,
    status: "IN STOCK",
    stock: 11,
  },
  {
    id: "seed-3",
    name: "PC Desktop Ultra Technology",
    description:
      "Direct Full Away, Ambient Mode. One remote control, quantum dot technology.",
    image: "/Images/comp2.jpg",
    sku: "SKU 1231452485251",
    oldPrice: 733.3,
    price: 662.32,
    status: "OUT OF STOCK",
    stock: 0,
  },
  {
    id: "seed-4",
    name: "Zony X201 Laptop Full Display SSD",
    description:
      "Direct Full Away, Ambient Mode. One remote control, quantum dot technology.",
    image: "/Images/comp3.jpg",
    sku: "SKU 1231452485251",
    oldPrice: 683.3,
    price: 523.65,
    status: "IN STOCK",
    stock: 9,
  },
];

export default function NewProduct() {
  const { formatCurrency } = useCurrency();
  const PRODUCTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const products = useMemo(() => {
    const localProducts = JSON.parse(
      localStorage.getItem("dashboardProducts") || "[]"
    );
    if (localProducts.length > 0) return localProducts;
    return fallbackProducts;
  }, []);

  const title = useMemo(() => {
    const topCategory = products[0]?.category || "Laptop";
    return `${topCategory} Products`;
  }, [products]);

  const formatPrice = (value) => formatCurrency(Number(value || 0));
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="new-product-page">
          <div className="new-product-head">
            <div>
              <h1>{title}</h1>
              <p>
                Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
                {Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)} of{" "}
                {products.length} product result(s)
              </p>
            </div>
            <div className="sort-box">
              <span>Show by</span>
              <button type="button" className="active-sort">
                Popularity
              </button>
              <button type="button">Newest</button>
              <button type="button">Trending</button>
            </div>
          </div>

          <div className="product-list">
            {currentProducts.map((product) => (
              <article className="product-row" key={product.id}>
                <img
                  className="product-image"
                  src={product.image || "/Images/lap.jpg"}
                  alt={product.name}
                />

                <div className="product-info">
                  <div className="meta-line">
                    <span className="stars">★★★★★</span>
                    <span className="sku">{product.sku || "SKU 1231452485251"}</span>
                  </div>
                  <h2>{product.name}</h2>
                  <ul>
                    <li>{product.description || "High-performance electronic device."}</li>
                    <li>Free delivery and warranty support available.</li>
                  </ul>
                </div>

                <div className="product-right">
                  <div className="icons-line">
                    <span>Free Delivery</span>
                    <span>Voucher 35%</span>
                    <span
                      className={`stock ${
                        (product.status || "").includes("OUT") ? "out" : "in"
                      }`}
                    >
                      {product.status || "IN STOCK"}
                    </span>
                  </div>

                  <div className="price-line">
                    <span className="old-price">
                      {formatPrice(product.oldPrice || product.price)}
                    </span>
                    <strong>{formatPrice(product.price)}</strong>
                  </div>

                  <div className="actions-line">
                    <button type="button" className="cart-btn">
                      Add to Home
                    </button>
                    <button type="button" className="wish-btn">
                      ♡
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  className={currentPage === page ? "active-page" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

