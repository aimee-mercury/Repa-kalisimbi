import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";
import "../../../Styles/AddProduct.scss";

const MAX_STORED_IMAGE_SIZE = 220000;
const MAX_SAVED_PRODUCTS = 40;
const DRAFTS_STORAGE_KEY = "dashboardProductDrafts";
const EMPTY_PRODUCT_IMAGE = "";
const POST_PRODUCT_NAV_ITEMS = [
  "Best Deals",
  "Top !o Selected",
  "Popular Search",
  "Hot Sale",
  "Recently",
];

const DEFAULT_FORM_DATA = {
  name: "",
  description: "",
  storage: "",
  deviceType: "",
  image: EMPTY_PRODUCT_IMAGE,
  images: [],
  price: "",
  stock: "",
  postalCode: "",
  discount: "",
  discountType: "",
  category: "",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const draftToEdit = useMemo(() => {
    try {
      const draftId = location.state?.draftId;
      if (!draftId) return null;

      const drafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || "[]");
      return drafts.find((draft) => draft.id === draftId) || null;
    } catch {
      return null;
    }
  }, [location.state]);

  const [selectedPostNav, setSelectedPostNav] = useState(
    draftToEdit?.sourceSection || POST_PRODUCT_NAV_ITEMS[0]
  );
  const [statusMessage, setStatusMessage] = useState(
    draftToEdit ? "Draft loaded." : ""
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState(() => {
    const baseCategories = ["Laptop", "Desktop", "Accessory", "Monitor"];
    if (draftToEdit?.category && !baseCategories.includes(draftToEdit.category)) {
      return [...baseCategories, draftToEdit.category];
    }
    return baseCategories;
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "Laptops & Computers",
    description:
      "Laptops and computers include portable and desktop systems designed for work, learning, gaming, and creative tasks. This category covers lightweight ultrabooks, high-performance workstations, and everyday PCs with reliable processing power and modern connectivity.",
  });
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(draftToEdit || {}),
    image:
      draftToEdit?.image ||
      (Array.isArray(draftToEdit?.images) ? draftToEdit.images[0] : "") ||
      EMPTY_PRODUCT_IMAGE,
  });
  const [productImages, setProductImages] = useState(
    Array.isArray(draftToEdit?.images) && draftToEdit.images.length > 0
      ? draftToEdit.images
      : draftToEdit?.image
        ? [draftToEdit.image]
        : []
  );

  const getSafeImageForStorage = (image) => {
    if (!image) return EMPTY_PRODUCT_IMAGE;
    if (!image.startsWith("data:")) return image;
    if (image.length <= MAX_STORED_IMAGE_SIZE) return image;
    return EMPTY_PRODUCT_IMAGE;
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
            resolve(EMPTY_PRODUCT_IMAGE);
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
    setErrorMessage("");
    setStatusMessage("");
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
    if (!formData.image) {
      setErrorMessage("Upload a product image before publishing.");
      setStatusMessage("");
      return;
    }

    const priceNumber = Number(String(formData.price).replace(/[^0-9.]/g, "")) || 0;
    const discountNumber = Number(String(formData.discount).replace(/[^0-9.]/g, "")) || 0;
    const oldPrice = priceNumber > 0 ? priceNumber : 0;
    const finalPrice =
      discountNumber > 0 ? oldPrice * (1 - discountNumber / 100) : oldPrice;

    const product = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      deviceType: formData.deviceType,
      storage: formData.storage,
      image: getSafeImageForStorage(formData.image),
      images: productImages.length > 0 ? productImages.map(getSafeImageForStorage) : [],
      sku: `SKU ${Date.now().toString().slice(-10)}`,
      oldPrice,
      price: finalPrice || oldPrice,
      stock: Number(formData.stock) || 0,
      postalCode: String(formData.postalCode || "").trim(),
      soldUnits: 0,
      discountType: formData.discountType,
      sourceSection: selectedPostNav,
      status: Number(formData.stock) > 0 ? "IN STOCK" : "OUT OF STOCK",
    };

    const existingProducts = JSON.parse(localStorage.getItem("dashboardProducts") || "[]");
    const didPersist = persistProductsSafely([product, ...existingProducts]);

    if (draftToEdit?.id) {
      const drafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || "[]");
      safeSetStorage(
        DRAFTS_STORAGE_KEY,
        JSON.stringify(drafts.filter((draft) => draft.id !== draftToEdit.id))
      );
    }

    navigate("/dashboard/products/new", {
      state: {
        savedProduct: product,
        storageFallback: !didPersist,
        sourceSection: selectedPostNav,
      },
    });
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || "[]");
    const draftPayload = {
      id: draftToEdit?.id || `draft-${Date.now()}`,
      createdAt: draftToEdit?.createdAt || new Date().toISOString(),
      savedAt: new Date().toISOString(),
      ...formData,
      image: getSafeImageForStorage(formData.image),
      images: productImages.length > 0 ? productImages.map(getSafeImageForStorage) : [],
      description: String(formData.description || "").slice(0, 320),
      sourceSection: selectedPostNav,
      status: "DRAFT",
    };

    const nextDrafts = [
      draftPayload,
      ...drafts.filter((draft) => draft.id !== draftPayload.id),
    ].slice(0, MAX_SAVED_PRODUCTS);

    if (!safeSetStorage(DRAFTS_STORAGE_KEY, JSON.stringify(nextDrafts))) {
      const compactDrafts = nextDrafts.map((draft) => ({
        ...draft,
        image: getSafeImageForStorage(draft.image),
        description: String(draft.description || "").slice(0, 160),
      }));
      safeSetStorage(DRAFTS_STORAGE_KEY, JSON.stringify(compactDrafts));
    }

    setErrorMessage("");
    setStatusMessage("Draft saved.");
    navigate("/dashboard/products/drafts");
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
      setProductImages((prev) => [uploadedImage, ...prev.filter((img) => img !== uploadedImage)].slice(0, 6));
      setErrorMessage("");
      setStatusMessage("Image uploaded.");
    } catch {
      setErrorMessage("Image upload failed. Try another image.");
      setStatusMessage("");
    }

    e.target.value = "";
  };

  const handleRemoveImage = (imageToRemove) => {
    setProductImages((prev) => {
      const nextImages = prev.filter((img) => img !== imageToRemove);

      setFormData((prevForm) => ({
        ...prevForm,
        image:
          prevForm.image === imageToRemove
            ? nextImages[0] || EMPTY_PRODUCT_IMAGE
            : prevForm.image,
      }));

      return nextImages;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setStatusMessage("Image removed.");
    setErrorMessage("");
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
              <button
                type="button"
                className="draft-btn"
                onClick={() => navigate("/dashboard/products/drafts")}
              >
                View Drafts
              </button>
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
                {formData.image ? (
                  <div className="image-preview-container">
                    <img src={formData.image} alt="Selected product" />
                    <button 
                      type="button" 
                      className="delete-image-btn"
                      onClick={() => handleRemoveImage(formData.image)}
                      aria-label="Remove selected image"
                      title="Remove selected image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="empty-preview">
                    <span>No image uploaded yet</span>
                    <button type="button" className="upload-preview-btn" onClick={handleOpenImagePicker}>
                      Upload Image
                    </button>
                  </div>
                )}
              </div>
              {formData.image && (
                <div className="image-preview-actions">
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={handleOpenImagePicker}
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    className="remove-image-text-btn"
                    onClick={() => handleRemoveImage(formData.image)}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <div className="thumb-row">
                {productImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className={`thumb-item ${formData.image === img ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className={`thumb-btn ${formData.image === img ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, image: img }))}
                    >
                      <img src={img} alt={`Product thumb ${index + 1}`} />
                    </button>
                    <button
                      type="button"
                      className="thumb-delete-btn"
                      onClick={() => handleRemoveImage(img)}
                      aria-label={`Remove image ${index + 1}`}
                      title="Remove image"
                    >
                      X
                    </button>
                  </div>
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
              {(statusMessage || errorMessage) && (
                <p className={`product-form-message ${errorMessage ? "error" : "success"}`}>
                  {errorMessage || statusMessage}
                </p>
              )}
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
              <div className="field-row two-col">
                <div>
                  <label className="field-label" htmlFor="postal-code">
                    Postal Code
                  </label>
                  <input
                    id="postal-code"
                    className="field-input"
                    value={formData.postalCode}
                    onChange={handleChange("postalCode")}
                  />
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
