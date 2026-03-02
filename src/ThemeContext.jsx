import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "site_theme_mode";
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    const isDark = themeMode === "dark";
    document.body.classList.toggle("site-dark", isDark);
    document.body.classList.toggle("site-light", !isDark);
    document.body.classList.toggle("dashboard-dark", isDark);
  }, [themeMode]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      toggleTheme: () => setThemeMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [themeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};

