import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";
import "../../../Styles/NewProduct.scss";

const LANDING_PRODUCTS_KEY = "landingPostedProducts";
const DASHBOARD_PRODUCTS_KEY = "dashboardProducts";

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
  const PRODUCTS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [priceMessage, setPriceMessage] = useState({ type: "", text: "" });
  const [products, setProducts] = useState(() => {
    const localProducts = JSON.parse(
      localStorage.getItem(DASHBOARD_PRODUCTS_KEY) || "[]"
    );
    const initialProducts = localProducts.length > 0 ? localProducts : fallbackProducts;
    return initialProducts.filter((product) => Number(product.stock || 0) > 0);
  });
  const navigate = useNavigate();
  const location = useLocation();

  const title = useMemo(() => {
    const selectedSection =
      location.state?.sourceSection || products[0]?.sourceSection || "Best Deals";
    return `${selectedSection} Products`;
  }, [location.state, products]);

  const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;
  const parsePriceValue = (value) => Number(String(value).replace(/[^0-9.]/g, "")) || 0;

  const safeSetStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddToHome = (product) => {
    const currentLandingProducts = JSON.parse(
      localStorage.getItem(LANDING_PRODUCTS_KEY) || "[]"
    );

    const landingProduct = {
      id: product.id || `home-product-${currentLandingProducts.length + 1}`,
      name: product.name,
      image: product.image || "",
      price: Number(product.price) || 0,
      stock: Number(product.stock || 0),
      rating: 5,
      sourceSection: product.sourceSection || location.state?.sourceSection || "Best Deals",
      onSale: (product.sourceSection || "").toLowerCase().includes("hot"),
    };

    safeSetStorage(
      LANDING_PRODUCTS_KEY,
      JSON.stringify([landingProduct, ...currentLandingProducts].slice(0, 50))
    );

    navigate("/", { state: { homeSection: landingProduct.sourceSection } });
  };

  const handleStartPriceEdit = (product) => {
    setEditingProductId(product.id);
    setEditedPrice(String(product.price ?? ""));
    setPriceMessage({ type: "", text: "" });
  };

  const handleCancelPriceEdit = () => {
    setEditingProductId(null);
    setEditedPrice("");
    setPriceMessage({ type: "", text: "" });
  };

  const handleSavePrice = (product) => {
    const nextPrice = parsePriceValue(editedPrice);
    if (nextPrice <= 0) {
      setPriceMessage({ type: "error", text: "Enter a valid price." });
      return;
    }

    try {
      const dashboardProducts = JSON.parse(
        localStorage.getItem(DASHBOARD_PRODUCTS_KEY) || "[]"
      );
      const landingProducts = JSON.parse(
        localStorage.getItem(LANDING_PRODUCTS_KEY) || "[]"
      );

      const nextDashboardProducts = dashboardProducts.map((item) =>
        item.id === product.id
          ? {
              ...item,
              oldPrice:
                Number(item.oldPrice || item.price || 0) === Number(item.price || 0)
                  ? Number(item.price || 0)
                  : Number(item.oldPrice || 0),
              price: nextPrice,
            }
          : item
      );

      const nextLandingProducts = landingProducts.map((item) =>
        item.id === product.id
          ? {
              ...item,
              price: nextPrice,
            }
          : item
      );

      safeSetStorage(DASHBOARD_PRODUCTS_KEY, JSON.stringify(nextDashboardProducts));
      safeSetStorage(LANDING_PRODUCTS_KEY, JSON.stringify(nextLandingProducts));
      setProducts(nextDashboardProducts.filter((item) => Number(item.stock || 0) > 0));
      setEditingProductId(null);
      setEditedPrice("");
      setPriceMessage({ type: "success", text: "Price updated." });
      window.dispatchEvent(new Event("storage"));
    } catch {
      setPriceMessage({ type: "error", text: "Price update failed." });
    }
  };

  React.useEffect(() => {
    const syncProducts = () => {
      try {
        const localProducts = JSON.parse(
          localStorage.getItem(DASHBOARD_PRODUCTS_KEY) || "[]"
        );
        const nextProducts = localProducts.length > 0 ? localProducts : fallbackProducts;
        setProducts(
          nextProducts.filter((product) => Number(product.stock || 0) > 0)
        );
      } catch {
        setProducts(fallbackProducts.filter((product) => Number(product.stock || 0) > 0));
      }
    };

    syncProducts();
    window.addEventListener("storage", syncProducts);
    return () => window.removeEventListener("storage", syncProducts);
  }, []);

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
                    <span className="source-tag">
                      {product.sourceSection || location.state?.sourceSection || "Best Deals"}
                    </span>
                  </div>
                  <h2>{product.name}</h2>
                  <ul>
                    <li>{product.description || "High-performance electronic device."}</li>
                    <li>Postal code: {product.postalCode || "Not provided"}</li>
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
                    {editingProductId === product.id ? (
                      <div className="price-edit-box">
                        <input
                          type="text"
                          className="price-edit-input"
                          value={editedPrice}
                          onChange={(event) => setEditedPrice(event.target.value)}
                        />
                        <div className="price-edit-actions">
                          <button
                            type="button"
                            className="save-price-btn"
                            onClick={() => handleSavePrice(product)}
                          >
                            Save Price
                          </button>
                          <button
                            type="button"
                            className="cancel-price-btn"
                            onClick={handleCancelPriceEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <strong>{formatPrice(product.price)}</strong>
                        <button
                          type="button"
                          className="edit-price-btn"
                          onClick={() => handleStartPriceEdit(product)}
                        >
                          Edit Price
                        </button>
                      </>
                    )}
                    {priceMessage.text && (
                      <span className={`price-message ${priceMessage.type}`}>
                        {priceMessage.text}
                      </span>
                    )}
                  </div>

                  <div className="actions-line">
                    <button
                      type="button"
                      className="cart-btn"
                      onClick={() => handleAddToHome(product)}
                    >
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

