const ORDERS_KEY = "store_orders";

export const readOrders = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const writeOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("storage"));
};

export const addOrder = (order) => {
  const next = [order, ...readOrders()].slice(0, 100);
  writeOrders(next);
  return order;
};
