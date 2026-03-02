const WEBSITE_NOTIFICATIONS_KEY = "website_notifications";

const readNotifications = () => {
  try {
    const raw = localStorage.getItem(WEBSITE_NOTIFICATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeNotifications = (items) => {
  try {
    localStorage.setItem(WEBSITE_NOTIFICATIONS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("website_notifications_updated"));
    return true;
  } catch {
    return false;
  }
};

export const getWebsiteNotifications = () => {
  return readNotifications().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const pushWebsiteNotification = ({
  type = "general",
  title = "Website Notification",
  message = "",
  meta = {},
}) => {
  const now = new Date().toISOString();
  const item = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    title,
    message,
    createdAt: now,
    read: false,
    meta,
  };

  const existing = readNotifications();
  const next = [item, ...existing].slice(0, 500);
  writeNotifications(next);
  return item;
};

export const markAllWebsiteNotificationsRead = () => {
  const existing = readNotifications();
  const next = existing.map((item) => ({ ...item, read: true }));
  writeNotifications(next);
};

export const getWebsiteUnreadCount = () => {
  return readNotifications().filter((item) => !item.read).length;
};
