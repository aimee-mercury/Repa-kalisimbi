import React, { createContext, useContext, useMemo, useState } from "react";

const CurrencyContext = createContext(null);

const STORAGE_KEY = "selectedCurrency";
const USD_TO_RWF = 1300;

const parseAmount = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "RWF" ? "RWF" : "USD";
  });

  const toggleCurrency = () => {
    setCurrency((prev) => {
      const next = prev === "USD" ? "RWF" : "USD";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const convertAmount = (usdAmount) => {
    const amount = parseAmount(usdAmount);
    return currency === "RWF" ? amount * USD_TO_RWF : amount;
  };

  const formatCurrency = (usdAmount) => {
    const amount = convertAmount(usdAmount);
    if (currency === "RWF") {
      return `RWF ${Math.round(amount).toLocaleString()}`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const value = useMemo(
    () => ({ currency, toggleCurrency, formatCurrency, convertAmount, parseAmount }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

