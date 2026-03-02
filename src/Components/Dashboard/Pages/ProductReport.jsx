import React, { useMemo } from "react";
import DashboardHeader from "../../Layout/Layout";
import Sidebar from "../../Layout/Sidebar";
import { useCurrency } from "../../../CurrencyContext";
import "../../../Styles/Home.scss";
import "../../../Styles/ProductReport.scss";

const DASHBOARD_PRODUCTS_KEY = "dashboardProducts";
const CART_ITEMS_KEY = "cart_items";

const parseNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeDate = (product) => {
  if (product.createdAt) {
    const date = new Date(product.createdAt);
    if (!Number.isNaN(date.getTime())) return date;
  }

  const idMatch = String(product.id || "").match(/(\d{10,})$/);
  if (idMatch) {
    const date = new Date(Number(idMatch[1]));
    if (!Number.isNaN(date.getTime())) return date;
  }

  return new Date();
};

const endOfDay = (date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const startOfWeek = (date) => {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfWeek = (date) => {
  const start = startOfWeek(date);
  const next = new Date(start);
  next.setDate(start.getDate() + 6);
  return endOfDay(next);
};

const startOfMonth = (date) => {
  const next = new Date(date.getFullYear(), date.getMonth(), 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfMonth = (date) => endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));

const startOfYear = (date) => {
  const next = new Date(date.getFullYear(), 0, 1);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfYear = (date) => endOfDay(new Date(date.getFullYear(), 11, 31));

const daysLeft = (date) => {
  const msLeft = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
};

const withinRange = (date, start, end) => date >= start && date <= end;

const toCsvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const formatDateGb = (date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const downloadFile = (filename, content, mime) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export default function ProductReport() {
  const { formatCurrency } = useCurrency();

  const report = useMemo(() => {
    const products = JSON.parse(localStorage.getItem(DASHBOARD_PRODUCTS_KEY) || "[]");
    const cartItems = JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || "[]");

    const soldById = cartItems.reduce((acc, item) => {
      const key = item.id || item.name;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + Math.max(0, parseNumber(item.quantity));
      return acc;
    }, {});

    const items = products.map((product) => {
      const price = parseNumber(product.price || product.oldPrice);
      const stock = Math.max(0, parseNumber(product.stock));
      const soldFromData = Math.max(0, parseNumber(product.soldUnits || product.sold));
      const soldFromCart = Math.max(
        0,
        parseNumber(soldById[product.id] || soldById[product.name] || 0)
      );
      const sold = Math.max(soldFromData, soldFromCart);
      const inStock = Math.max(0, stock - sold);
      const revenue = sold * price;
      const createdAt = normalizeDate(product);

      return {
        ...product,
        price,
        sold,
        inStock,
        revenue,
        createdAt,
      };
    });

    const totalProducts = items.length;
    const totalSold = items.reduce((sum, item) => sum + item.sold, 0);
    const totalInStock = items.reduce((sum, item) => sum + item.inStock, 0);
    const totalRevenue = items.reduce((sum, item) => sum + item.revenue, 0);
    const sellThroughBase = totalSold + totalInStock;
    const sellThroughRate = sellThroughBase > 0 ? (totalSold / sellThroughBase) * 100 : 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const periods = [
      {
        key: "week",
        label: "Weekly Close",
        start: startOfWeek(now),
        end: endOfWeek(now),
      },
      {
        key: "month",
        label: "Monthly Close",
        start: startOfMonth(now),
        end: endOfMonth(now),
      },
      {
        key: "year",
        label: "Yearly Close",
        start: startOfYear(now),
        end: endOfYear(now),
      },
    ].map((period) => {
      const scoped = items.filter((item) => withinRange(item.createdAt, period.start, period.end));
      const sold = scoped.reduce((sum, item) => sum + item.sold, 0);
      const revenue = scoped.reduce((sum, item) => sum + item.revenue, 0);
      const stock = scoped.reduce((sum, item) => sum + item.inStock, 0);
      const progressBase = sold + stock;
      const progressRate = progressBase > 0 ? (sold / progressBase) * 100 : 0;

      return {
        ...period,
        products: scoped.length,
        sold,
        stock,
        revenue,
        daysLeft: daysLeft(period.end),
        progressRate,
      };
    });

    return {
      items,
      totals: {
        totalProducts,
        totalSold,
        totalInStock,
        totalRevenue,
        sellThroughRate,
      },
      periods,
      yearCalendar: Array.from({ length: 12 }, (_, index) => {
        const monthStart = new Date(currentYear, index, 1);
        monthStart.setHours(0, 0, 0, 0);
        const monthEnd = endOfMonth(monthStart);
        const scoped = items.filter((item) => withinRange(item.createdAt, monthStart, monthEnd));
        const sold = scoped.reduce((sum, item) => sum + item.sold, 0);
        const revenue = scoped.reduce((sum, item) => sum + item.revenue, 0);
        const stock = scoped.reduce((sum, item) => sum + item.inStock, 0);

        let status = "Upcoming";
        if (monthEnd.getTime() < now.getTime()) status = "Closed";
        else if (monthStart.getTime() <= now.getTime()) status = "In Progress";

        return {
          month: monthStart.toLocaleString("en-GB", { month: "short" }),
          sold,
          revenue,
          stock,
          status,
          daysLeft: daysLeft(monthEnd),
        };
      }),
      currentYear,
      generatedAt: now,
    };
  }, []);

  const reportTitle = `Sales Stock Report - ${report.generatedAt.toISOString().slice(0, 10)}`;

  const exportCsv = () => {
    const headers = [
      "Product",
      "Category",
      "Price",
      "Sold Units",
      "In Stock",
      "Revenue",
      "Status",
      "Created At",
    ];

    const rows = report.items.map((item) => [
      item.name || "Untitled Product",
      item.category || "Uncategorized",
      item.price.toFixed(2),
      item.sold,
      item.inStock,
      item.revenue.toFixed(2),
      item.inStock > 0 ? "IN STOCK" : "OUT OF STOCK",
      item.createdAt.toISOString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\n");
    downloadFile(`${reportTitle}.csv`, csv, "text/csv;charset=utf-8;");
  };

  const reportHtml = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { margin: 0 0 8px; font-size: 24px; }
          h2 { margin: 22px 0 8px; font-size: 18px; }
          p { margin: 0 0 12px; color: #4b5563; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h1>${reportTitle}</h1>
        <p>Generated on ${report.generatedAt.toLocaleString()} (date format DD/MM/YYYY, example: 02/03/2026)</p>

        <h2>Overview</h2>
        <table>
          <tr><th>Total Products</th><th>Total Sold Units</th><th>Current Stock</th><th>Total Revenue</th><th>Sell Through</th></tr>
          <tr>
            <td>${report.totals.totalProducts}</td>
            <td>${report.totals.totalSold}</td>
            <td>${report.totals.totalInStock}</td>
            <td>${formatCurrency(report.totals.totalRevenue)}</td>
            <td>${report.totals.sellThroughRate.toFixed(1)}%</td>
          </tr>
        </table>

        <h2>Close Status (Week / Month / Year)</h2>
        <table>
          <tr><th>Period</th><th>Products in Period</th><th>Sold Units</th><th>Stock Left</th><th>Revenue</th><th>Close Progress</th><th>Days Left</th></tr>
          ${report.periods
            .map(
              (period) => `
            <tr>
              <td>${period.label}</td>
              <td>${period.products}</td>
              <td>${period.sold}</td>
              <td>${period.stock}</td>
              <td>${formatCurrency(period.revenue)}</td>
              <td>${period.progressRate.toFixed(1)}%</td>
              <td>${period.daysLeft}</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <h2>${report.currentYear} Year Calendar Summary</h2>
        <table>
          <tr><th>Month</th><th>Sold Units</th><th>Stock Left</th><th>Revenue</th><th>Status</th><th>Days Left</th></tr>
          ${report.yearCalendar
            .map(
              (month) => `
            <tr>
              <td>${month.month}</td>
              <td>${month.sold}</td>
              <td>${month.stock}</td>
              <td>${formatCurrency(month.revenue)}</td>
              <td>${month.status}</td>
              <td>${month.daysLeft}</td>
            </tr>
          `
            )
            .join("")}
        </table>

        <h2>Product Detail</h2>
        <table>
          <tr><th>Product</th><th>Category</th><th>Price</th><th>Sold</th><th>In Stock</th><th>Revenue</th><th>Status</th></tr>
          ${report.items
            .map(
              (item) => `
            <tr>
              <td>${item.name || "Untitled Product"}</td>
              <td>${item.category || "Uncategorized"}</td>
              <td>${formatCurrency(item.price)}</td>
              <td>${item.sold}</td>
              <td>${item.inStock}</td>
              <td>${formatCurrency(item.revenue)}</td>
              <td>${item.inStock > 0 ? "IN STOCK" : "OUT OF STOCK"}</td>
            </tr>
          `
            )
            .join("")}
        </table>
      </body>
    </html>
  `;

  const exportWord = () => {
    downloadFile(
      `${reportTitle}.doc`,
      reportHtml,
      "application/msword;charset=utf-8;"
    );
  };

  const exportPdf = () => {
    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-main">
        <DashboardHeader />
        <div className="product-report-page">
          <div className="report-head">
            <div>
              <h1 className="page-title">Sales & Stock Report</h1>
              <p>
                Shows what you sell, what is left in stock, and close status for week, month, and year.
              </p>
              <p>
                Today: <strong>{formatDateGb(report.generatedAt)}</strong> (DD/MM/YYYY)
              </p>
            </div>
            <div className="export-actions">
              <button type="button" onClick={exportCsv}>
                Export Excel
              </button>
              <button type="button" onClick={exportWord}>
                Export Word
              </button>
              <button type="button" className="primary" onClick={exportPdf}>
                Generate PDF
              </button>
            </div>
          </div>

          <div className="summary-grid">
            <article className="summary-card">
              <span>Total Products</span>
              <strong>{report.totals.totalProducts}</strong>
            </article>
            <article className="summary-card">
              <span>Total Sold</span>
              <strong>{report.totals.totalSold}</strong>
            </article>
            <article className="summary-card">
              <span>Current Stock</span>
              <strong>{report.totals.totalInStock}</strong>
            </article>
            <article className="summary-card">
              <span>Total Revenue</span>
              <strong>{formatCurrency(report.totals.totalRevenue)}</strong>
            </article>
            <article className="summary-card">
              <span>Sell Through Rate</span>
              <strong>{report.totals.sellThroughRate.toFixed(1)}%</strong>
            </article>
          </div>

          <section className="panel close-panel">
            <h3>Close Status</h3>
            <div className="close-grid">
              {report.periods.map((period) => (
                <article key={period.key} className="close-card">
                  <h4>{period.label}</h4>
                  <p>
                    <span>Products:</span> {period.products}
                  </p>
                  <p>
                    <span>Sold:</span> {period.sold}
                  </p>
                  <p>
                    <span>Stock Left:</span> {period.stock}
                  </p>
                  <p>
                    <span>Revenue:</span> {formatCurrency(period.revenue)}
                  </p>
                  <p>
                    <span>Progress:</span> {period.progressRate.toFixed(1)}%
                  </p>
                  <p>
                    <span>Days Left:</span> {period.daysLeft}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel close-panel">
            <h3>{report.currentYear} Year Calendar</h3>
            <div className="report-table-scroll">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Sold Units</th>
                    <th>Stock Left</th>
                    <th>Revenue</th>
                    <th>Status</th>
                    <th>Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {report.yearCalendar.map((month) => (
                    <tr key={month.month}>
                      <td>{month.month}</td>
                      <td>{month.sold}</td>
                      <td>{month.stock}</td>
                      <td>{formatCurrency(month.revenue)}</td>
                      <td>{month.status}</td>
                      <td>{month.daysLeft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel report-table-wrap">
            <h3>Product Detail</h3>
            {report.items.length === 0 ? (
              <p className="empty-state">
                No products found. Add products first from "Add Product" to generate report rows.
              </p>
            ) : (
              <div className="report-table-scroll">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Sold</th>
                      <th>In Stock</th>
                      <th>Revenue</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name || "Untitled Product"}</td>
                        <td>{item.category || "Uncategorized"}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.sold}</td>
                        <td>{item.inStock}</td>
                        <td>{formatCurrency(item.revenue)}</td>
                        <td>{item.inStock > 0 ? "IN STOCK" : "OUT OF STOCK"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
