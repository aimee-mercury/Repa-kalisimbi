import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";
import "../../../Styles/AddProduct.scss";

const DEFAULT_PRODUCT_IMAGE = "/Images/lap.jpg";
const MAX_STORED_IMAGE_SIZE = 220000;
const MAX_SAVED_PRODUCTS = 40;
const POST_PRODUCT_NAV_ITEMS = [
  "Best Deals",
  "Top !o Selected",
  "Popular Search",
  "Hot Sale",
  "Recently",
];

export default function AddProduct() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [selectedPostNav, setSelectedPostNav] = useState(POST_PRODUCT_NAV_ITEMS[0]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([
    "Laptop",
    "Desktop",
    "Accessory",
    "Monitor",
  ]);
  const [categoryForm, setCategoryForm] = useState({
    name: "Laptops & Computers",
    description:
      "Laptops and computers include portable and desktop systems designed for work, learning, gaming, and creative tasks. This category covers lightweight ultrabooks, high-performance workstations, and everyday PCs with reliable processing power and modern connectivity.",
  });
  const [formData, setFormData] = useState({
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    description:
      "Premium ultrabook with Intel Core Ultra processor, 14-inch anti-glare display, 16GB RAM, and 512GB NVMe SSD. Built for business productivity with lightweight carbon-fiber chassis, all-day battery life, and advanced security.",
    storage: "512GB",
    deviceType: "Laptop",
    image: DEFAULT_PRODUCT_IMAGE,
    price: "$1,499",
    stock: "42",
    discount: "8%",
    discountType: "Back to School Deal",
    category: "Laptop",
  });
  const [productImages, setProductImages] = useState([
    DEFAULT_PRODUCT_IMAGE,
    "/Images/comp.jpg",
    "/Images/comp2.jpg",
  ]);

  const getSafeImageForStorage = (image) => {
    if (!image) return DEFAULT_PRODUCT_IMAGE;
    if (!image.startsWith("data:")) return image;
    if (image.length <= MAX_STORED_IMAGE_SIZE) return image;
    return DEFAULT_PRODUCT_IMAGE;
  };

  const safeSetStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error?.name !== "QuotaExceededError") {
        throw error;
      }
      return false;
    }
  };

  const persistProductsSafely = (products) => {
    const limitedProducts = products.slice(0, MAX_SAVED_PRODUCTS);
    if (safeSetStorage("dashboardProducts", JSON.stringify(limitedProducts))) {
      return true;
    }

    const compactProducts = limitedProducts.map((item) => ({
      ...item,
      image: getSafeImageForStorage(item.image),
      description: String(item.description || "").slice(0, 240),
    }));

    for (let size = compactProducts.length; size >= 1; size -= 1) {
      const candidate = compactProducts.slice(0, size);
      if (safeSetStorage("dashboardProducts", JSON.stringify(candidate))) {
        return true;
      }
    }

    return false;
  };

  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 900;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(DEFAULT_PRODUCT_IMAGE);
            return;
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };
        img.onerror = reject;
        img.src = String(reader.result || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleChange = (key) => (e) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSaveCategory = () => {
    const name = categoryForm.name.trim();
    if (!name) return;
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
    }
    setFormData((prev) => ({ ...prev, category: name }));
    setIsCategoryModalOpen(false);
  };

  const handleSaveProduct = () => {
    const priceNumber = Number(String(formData.price).replace(/[^0-9.]/g, "")) || 0;
    const discountNumber = Number(String(formData.discount).replace(/[^0-9.]/g, "")) || 0;
    const oldPrice = priceNumber > 0 ? priceNumber : 0;
    const finalPrice =
      discountNumber > 0 ? oldPrice * (1 - discountNumber / 100) : oldPrice;

    const product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      deviceType: formData.deviceType,
      storage: formData.storage,
      image: getSafeImageForStorage(formData.image),
      sku: `SKU ${Date.now().toString().slice(-10)}`,
      oldPrice,
      price: finalPrice || oldPrice,
      stock: Number(formData.stock) || 0,
      discountType: formData.discountType,
      sourceSection: selectedPostNav,
      status: Number(formData.stock) > 0 ? "IN STOCK" : "OUT OF STOCK",
    };

    const existingProducts = JSON.parse(localStorage.getItem("dashboardProducts") || "[]");
    const didPersist = persistProductsSafely([product, ...existingProducts]);

    navigate("/dashboard/products/new", {
      state: {
        savedProduct: product,
        storageFallback: !didPersist,
        sourceSection: selectedPostNav,
      },
    });
  };

  const handleSaveDraft = () => {
    const draftPayload = {
      ...formData,
      image: getSafeImageForStorage(formData.image),
      description: String(formData.description || "").slice(0, 320),
      sourceSection: selectedPostNav,
    };

    if (!safeSetStorage("dashboardProductDraft", JSON.stringify(draftPayload))) {
      const minimalDraft = {
        ...draftPayload,
        image: DEFAULT_PRODUCT_IMAGE,
        description: "",
      };
      safeSetStorage("dashboardProductDraft", JSON.stringify(minimalDraft));
    }
  };

  const handleOpenImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedImage = await compressImage(file);
      if (!uploadedImage) return;
      setFormData((prev) => ({ ...prev, image: uploadedImage }));
      setProductImages((prev) => [uploadedImage, ...prev].slice(0, 6));
    } catch {
      setFormData((prev) => ({ ...prev, image: DEFAULT_PRODUCT_IMAGE }));
    }

    e.target.value = "";
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="add-product-page">
          <div className="add-product-top">
            <div className="add-product-title-wrap">
              <h1 className="page-title">Post Product</h1>
              <nav className="post-product-nav" aria-label="Post product quick links">
                <ul>
                  {POST_PRODUCT_NAV_ITEMS.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={selectedPostNav === item ? "active" : ""}
                        onClick={() => setSelectedPostNav(item)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="top-actions">
              <button type="button" className="draft-btn" onClick={handleSaveDraft}>
                Save Draft
              </button>
              <button type="button" className="publish-btn" onClick={handleSaveProduct}>
                OK Save Product
              </button>
            </div>
          </div>

          <div className="add-product-grid">
            <section className="add-card">
              <h2>General Information</h2>

              <label className="field-label" htmlFor="product-name">
                Name Product
              </label>
              <input
                id="product-name"
                className="field-input"
                value={formData.name}
                onChange={handleChange("name")}
              />

              <label className="field-label" htmlFor="product-description">
                Description Product
              </label>
              <textarea
                id="product-description"
                className="field-textarea"
                value={formData.description}
                onChange={handleChange("description")}
              />

              <div className="field-row">
                <div>
                  <label className="field-label">Storage</label>
                  <div className="size-row">
                    <button
                      type="button"
                      className={`chip ${formData.storage === "256GB" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, storage: "256GB" }))
                      }
                    >
                      256GB
                    </button>
                    <button
                      type="button"
                      className={`chip ${formData.storage === "512GB" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, storage: "512GB" }))
                      }
                    >
                      512GB
                    </button>
                    <button
                      type="button"
                      className={`chip ${formData.storage === "1TB" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, storage: "1TB" }))
                      }
                    >
                      1TB
                    </button>
                    <button
                      type="button"
                      className={`chip ${formData.storage === "2TB" ? "active" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, storage: "2TB" }))
                      }
                    >
                      2TB
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label">Device Type</label>
                  <div className="radio-row">
                    <label>
                      <input
                        type="radio"
                        name="device-type"
                        checked={formData.deviceType === "Laptop"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, deviceType: "Laptop" }))
                        }
                      />
                      Laptop
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="device-type"
                        checked={formData.deviceType === "Desktop"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, deviceType: "Desktop" }))
                        }
                      />
                      Desktop
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="device-type"
                        checked={formData.deviceType === "Tablet"}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, deviceType: "Tablet" }))
                        }
                      />
                      Tablet
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="add-card right-card">
              <h2>Upload Img</h2>
              <div className="main-preview">
                <img src={formData.image} alt="Laptop product" />
              </div>
              <div className="thumb-row">
                {productImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    className={`thumb-btn ${formData.image === img ? "active" : ""}`}
                    onClick={() => setFormData((prev) => ({ ...prev, image: img }))}
                  >
                    <img src={img} alt={`Laptop thumb ${index + 1}`} />
                  </button>
                ))}
                <button
                  type="button"
                  className="more-thumb"
                  onClick={handleOpenImagePicker}
                >
                  +
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="image-input-hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </section>

            <section className="add-card">
              <h2>Pricing And Stock</h2>
              <div className="field-row two-col">
                <div>
                  <label className="field-label" htmlFor="base-price">
                    Base Pricing
                  </label>
                  <input
                    id="base-price"
                    className="field-input"
                    value={formData.price}
                    onChange={handleChange("price")}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    id="stock"
                    className="field-input"
                    value={formData.stock}
                    onChange={handleChange("stock")}
                  />
                </div>
              </div>
              <div className="field-row two-col">
                <div>
                  <label className="field-label" htmlFor="discount">
                    Discount
                  </label>
                  <input
                    id="discount"
                    className="field-input"
                    value={formData.discount}
                    onChange={handleChange("discount")}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="discount-type">
                    Discount Type
                  </label>
                  <select
                    id="discount-type"
                    className="field-input select-input"
                    value={formData.discountType}
                    onChange={handleChange("discountType")}
                  >
                    <option>Back to School Deal</option>
                    <option>Holiday Promotion</option>
                    <option>Clearance Offer</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="add-card right-card">
              <h2>Category</h2>
              <label className="field-label" htmlFor="product-category">
                Product Category
              </label>
              <select
                id="product-category"
                className="field-input select-input"
                value={formData.category}
                onChange={handleChange("category")}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              <button
                type="button"
                className="category-btn"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                Add Category
              </button>
            </section>
          </div>
        </div>

        {isCategoryModalOpen && (
          <div
            className="category-modal-overlay"
            onClick={() => setIsCategoryModalOpen(false)}
          >
            <div className="category-modal" onClick={(e) => e.stopPropagation()}>
              <div className="category-modal-head">
                <h3>Add Category</h3>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setIsCategoryModalOpen(false)}
                >
                  x
                </button>
              </div>

              <label className="field-label" htmlFor="category-name">
                Category Name
              </label>
              <input
                id="category-name"
                className="field-input"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <label className="field-label" htmlFor="category-description">
                Description Category
              </label>
              <textarea
                id="category-description"
                className="field-textarea category-textarea"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />

              <div className="category-actions">
                <button
                  type="button"
                  className="save-category-btn"
                  onClick={handleSaveCategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
