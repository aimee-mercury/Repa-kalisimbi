import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const trySetStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e?.name !== 'QuotaExceededError') {
      throw e;
    }
    return false;
  }
};

const readStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    console.error('Failed to load user from localStorage:', e);
    return null;
  }
};

const displayNameFromEmail = (email = '') => {
  const [localPart = 'User'] = String(email).split('@');
  return localPart
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ensureSettingsProfile = (userData) => {
  if (typeof window === 'undefined' || !userData) return;
  const savedSettings = JSON.parse(localStorage.getItem('settingsProfile') || '{}');
  const parts = String(userData.name || '').split(' ');
  const firstName = savedSettings.firstName || parts[0] || displayNameFromEmail(userData.email);
  const lastName = savedSettings.lastName || parts.slice(1).join(' ');

  const sanitizedAvatar =
    savedSettings.avatar && !String(savedSettings.avatar).includes("/Images/profile.jpg")
      ? savedSettings.avatar
      : "";

  const merged = {
    firstName,
    lastName,
    email: userData.email || savedSettings.email || '',
    phone: savedSettings.phone || '',
    dob: savedSettings.dob || '',
    role: savedSettings.role || 'Admin',
    country: savedSettings.country || '',
    city: savedSettings.city || '',
    postalCode: savedSettings.postalCode || '',
    avatar: sanitizedAvatar,
  };

  trySetStorage('settingsProfile', JSON.stringify(merged));
};

export const AuthProvider = ({ children }) => {
  const initialUser = readStoredUser();
  const [user, setUser] = useState(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialUser));
  const [loading] = useState(false);

  const login = (email, password) => {
    // Simple validation (in production, this would call a backend API)
    if (email && password) {
      const userData = {
        email,
        name: displayNameFromEmail(email),
        avatar: '',
        createdAt: new Date().toISOString(),
      };
      trySetStorage('user', JSON.stringify(userData));
      ensureSettingsProfile(userData);
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const signup = (name, email, password, confirmPassword) => {
    // Simple validation (in production, this would call a backend API)
    const trimmedName = String(name || '').trim();
    if (trimmedName && email && password && password === confirmPassword) {
      const userData = {
        email,
        name: trimmedName,
        avatar: '',
        createdAt: new Date().toISOString(),
      };
      trySetStorage('user', JSON.stringify(userData));
      ensureSettingsProfile(userData);
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUserProfile = (profileData) => {
    if (!profileData) return;
    const nextName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
    setUser((prev) => {
      const base = prev || {};
      const nextUser = {
        ...base,
        email: profileData.email || base.email || '',
        name: nextName || base.name || '',
        avatar: profileData.avatar || '',
      };
      trySetStorage('user', JSON.stringify(nextUser));
      return nextUser;
    });
    trySetStorage('settingsProfile', JSON.stringify(profileData));
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, signup, logout, loading, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
