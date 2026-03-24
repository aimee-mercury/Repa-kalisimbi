import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import "../../../Styles/Home.scss";
import "../../../Styles/DraftProducts.scss";

const DRAFTS_STORAGE_KEY = "dashboardProductDrafts";

const formatDraftDate = (value) => {
  if (!value) return "Not saved yet";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Not saved yet";
  }
};

export default function DraftProducts() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const loadDrafts = () => {
      try {
        const storedDrafts = JSON.parse(localStorage.getItem(DRAFTS_STORAGE_KEY) || "[]");
        setDrafts(storedDrafts);
      } catch {
        setDrafts([]);
      }
    };

    loadDrafts();
    window.addEventListener("storage", loadDrafts);
    window.addEventListener("focus", loadDrafts);
    return () => {
      window.removeEventListener("storage", loadDrafts);
      window.removeEventListener("focus", loadDrafts);
    };
  }, []);

  const handleDeleteDraft = (draftId) => {
    const nextDrafts = drafts.filter((draft) => draft.id !== draftId);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(nextDrafts));
    setDrafts(nextDrafts);
  };

  const handleOpenDraft = (draftId) => {
    navigate("/dashboard/products/add", { state: { draftId } });
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="draft-products-page">
          <div className="draft-products-head">
            <div>
              <h1>Draft Products</h1>
              <p>{drafts.length} draft product(s) saved for later posting.</p>
            </div>
            <button
              type="button"
              className="new-draft-btn"
              onClick={() => navigate("/dashboard/products/add")}
            >
              New Post
            </button>
          </div>

          {drafts.length === 0 ? (
            <div className="draft-empty-state">
              <h2>No drafts yet</h2>
              <p>Save a product as draft and it will appear here for later editing.</p>
            </div>
          ) : (
            <div className="draft-list">
              {drafts.map((draft) => (
                <article className="draft-card" key={draft.id}>
                  <div className="draft-image-wrap">
                    {draft.image ? (
                      <img src={draft.image} alt={draft.name} className="draft-image" />
                    ) : (
                      <div className="draft-image-empty">No image</div>
                    )}
                  </div>

                  <div className="draft-info">
                    <div className="draft-meta">
                      <span className="draft-badge">{draft.sourceSection || "Best Deals"}</span>
                      <span>Saved: {formatDraftDate(draft.savedAt)}</span>
                    </div>
                    <h2>{draft.name || "Untitled Draft"}</h2>
                    <p>{draft.description || "No description added yet."}</p>
                    <div className="draft-details">
                      <span>Category: {draft.category || "Uncategorized"}</span>
                      <span>Price: {draft.price || "Not set"}</span>
                      <span>Stock: {draft.stock || "Not set"}</span>
                      <span>Postal code: {draft.postalCode || "Not set"}</span>
                    </div>
                  </div>

                  <div className="draft-actions">
                    <button type="button" className="open-draft-btn" onClick={() => handleOpenDraft(draft.id)}>
                      Continue Draft
                    </button>
                    <button
                      type="button"
                      className="delete-draft-btn"
                      onClick={() => handleDeleteDraft(draft.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
