import React from "react";
import { Link } from "react-router-dom";

const BrandMark = ({ to = "/", compact = false }) => (
  <Link to={to} className={`brand-mark ${compact ? "compact" : ""}`}>
    <span className="brand-mark__icon" aria-hidden="true">
      RK
    </span>
    <span className="brand-mark__text">
      <strong>Repa</strong>
      <em>Kalisimbi</em>
    </span>
  </Link>
);

export default BrandMark;
