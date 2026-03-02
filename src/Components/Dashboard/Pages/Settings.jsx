import React, { useContext, useRef, useState } from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import { AuthContext } from "../../../AuthContext";
import "../../../Styles/Home.scss";
import "../../../Styles/Settings.scss";

const MAX_PROFILE_TEXT = 180;
const MAX_AVATAR_DATA_SIZE = 240000;

export default function Settings() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const imageInputRef = useRef(null);
  const [activeEditor, setActiveEditor] = useState(null);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("settingsProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (String(parsed.avatar || "").includes("/Images/profile.jpg")) {
        parsed.avatar = "";
      }
      parsed.email = user?.email || parsed.email || "";
      return parsed;
    }
    const [firstName = "User", lastName = ""] = String(user?.name || "User").split(" ");
    return {
      firstName,
      lastName,
      email: user?.email || "",
      phone: "",
      dob: "",
      role: "Admin",
      country: "",
      city: "",
      postalCode: "",
      avatar: "",
    };
  });
  const [editorData, setEditorData] = useState(profile);

  const openEditor = (section) => {
    setEditorData(profile);
    setActiveEditor(section);
  };

  const closeEditor = () => {
    setActiveEditor(null);
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

  const sanitizeProfileForStorage = (nextData, keepAvatar = true) => ({
    ...nextData,
    firstName: String(nextData.firstName || "").slice(0, MAX_PROFILE_TEXT),
    lastName: String(nextData.lastName || "").slice(0, MAX_PROFILE_TEXT),
    email: String(nextData.email || "").slice(0, MAX_PROFILE_TEXT),
    phone: String(nextData.phone || "").slice(0, MAX_PROFILE_TEXT),
    dob: String(nextData.dob || "").slice(0, MAX_PROFILE_TEXT),
    role: String(nextData.role || "").slice(0, MAX_PROFILE_TEXT),
    country: String(nextData.country || "").slice(0, MAX_PROFILE_TEXT),
    city: String(nextData.city || "").slice(0, MAX_PROFILE_TEXT),
    postalCode: String(nextData.postalCode || "").slice(0, MAX_PROFILE_TEXT),
    avatar:
      keepAvatar && String(nextData.avatar || "").length <= MAX_AVATAR_DATA_SIZE
        ? nextData.avatar
        : "",
  });

  const saveProfile = (nextData) => {
    const normalized = sanitizeProfileForStorage(nextData, true);
    setProfile(normalized);
    updateUserProfile(normalized);

    const didStoreFull = safeSetStorage("settingsProfile", JSON.stringify(normalized));
    if (!didStoreFull) {
      const noAvatar = sanitizeProfileForStorage(normalized, false);
      safeSetStorage("settingsProfile", JSON.stringify(noAvatar));
    }
  };

  const handleSaveChanges = () => {
    saveProfile(editorData);
    closeEditor();
  };

  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 700;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve("");
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.68));
        };
        img.onerror = reject;
        img.src = String(reader.result || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const avatar = String(await compressImage(file));
      if (!avatar) return;
      const next = { ...profile, avatar };
      saveProfile(next);
    } catch {
      const next = { ...profile, avatar: "" };
      saveProfile(next);
    }
    e.target.value = "";
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="settings-page">
          <h1 className="settings-title">My Profile</h1>

          <section className="settings-card profile-card">
            <div className="profile-image-wrap">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" />
              ) : (
                <div className="profile-placeholder">
                  {`${profile.firstName || ""} ${profile.lastName || ""}`.trim().charAt(0).toUpperCase() ||
                    "U"}
                </div>
              )}
              <button
                type="button"
                className="avatar-edit-btn"
                onClick={() => imageInputRef.current?.click()}
              >
                Edit
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="avatar-file-input"
                onChange={handleUploadAvatar}
              />
            </div>
            <div className="profile-info">
              <h2>{profile.firstName} {profile.lastName}</h2>
              <p className="role">{profile.role}</p>
              <p className="location">
                {profile.city}, {profile.country}
              </p>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-head">
              <h3>Personal Information</h3>
              <button type="button" onClick={() => openEditor("personal")}>
                Edit
              </button>
            </div>
            <div className="info-grid three-col">
              <div className="info-item">
                <span>First Name</span>
                <strong>{profile.firstName}</strong>
              </div>
              <div className="info-item">
                <span>Last Name</span>
                <strong>{profile.lastName}</strong>
              </div>
              <div className="info-item">
                <span>Date of Birth</span>
                <strong>{profile.dob}</strong>
              </div>
              <div className="info-item">
                <span>Email Address</span>
                <strong>{profile.email}</strong>
              </div>
              <div className="info-item">
                <span>Phone Number</span>
                <strong>{profile.phone}</strong>
              </div>
              <div className="info-item">
                <span>User Role</span>
                <strong>{profile.role}</strong>
              </div>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-head">
              <h3>Address</h3>
              <button type="button" onClick={() => openEditor("address")}>
                Edit
              </button>
            </div>
            <div className="info-grid three-col">
              <div className="info-item">
                <span>Country</span>
                <strong>{profile.country}</strong>
              </div>
              <div className="info-item">
                <span>City</span>
                <strong>{profile.city}</strong>
              </div>
              <div className="info-item">
                <span>Postal Code</span>
                <strong>{profile.postalCode}</strong>
              </div>
            </div>
          </section>
        </div>

        {activeEditor && (
          <div className="settings-modal-overlay" onClick={closeEditor}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="settings-modal-head">
                <h3>
                  {activeEditor === "personal"
                    ? "Edit Personal Information"
                    : "Edit Address"}
                </h3>
                <button type="button" className="close-btn" onClick={closeEditor}>
                  x
                </button>
              </div>

              {activeEditor === "personal" ? (
                <div className="modal-grid">
                  <label>
                    <span>First Name</span>
                    <input
                      value={editorData.firstName}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>Last Name</span>
                    <input
                      value={editorData.lastName}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                    />
                  </label>
                  <label className="full-row">
                    <span>Email Address</span>
                    <input
                      value={editorData.email}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </label>
                  <label className="full-row">
                    <span>Phone Number</span>
                    <input
                      value={editorData.phone}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </label>
                  <label className="full-row">
                    <span>Date of Birth</span>
                    <input
                      value={editorData.dob}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, dob: e.target.value }))
                      }
                    />
                  </label>
                  <label className="full-row">
                    <span>User Role</span>
                    <select
                      value={editorData.role}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, role: e.target.value }))
                      }
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Editor</option>
                    </select>
                  </label>
                </div>
              ) : (
                <div className="modal-grid">
                  <label>
                    <span>Country</span>
                    <input
                      value={editorData.country}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, country: e.target.value }))
                      }
                    />
                  </label>
                  <label>
                    <span>City</span>
                    <input
                      value={editorData.city}
                      onChange={(e) =>
                        setEditorData((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </label>
                  <label className="full-row">
                    <span>Postal Code</span>
                    <input
                      value={editorData.postalCode}
                      onChange={(e) =>
                        setEditorData((prev) => ({
                          ...prev,
                          postalCode: e.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
              )}

              <div className="settings-modal-actions">
                <button type="button" className="save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
