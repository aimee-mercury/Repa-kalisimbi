import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../../Styles/Footer.scss";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const savedSubscribers = JSON.parse(localStorage.getItem("newsletterSubscribers") || "[]");
      const subscribers = Array.isArray(savedSubscribers) ? savedSubscribers : [];
      if (!subscribers.includes(normalizedEmail)) {
        localStorage.setItem("newsletterSubscribers", JSON.stringify([...subscribers, normalizedEmail]));
      }
      setSubscribed(true);
      setSubscribeError("");
    } catch (error) {
      console.error("Unable to save newsletter subscription:", error);
      setSubscribeError("We couldn’t save your email in this browser. Please try again.");
    }
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="footer-newsletter">
        <div className="container footer-newsletter__inner">
          <div className="newsletter-text">
            <span className="store-eyebrow">GOOD THINGS, OCCASIONALLY</span>
            <h3>A little more good in your inbox.</h3>
            <p>New arrivals, useful ideas, and offers worth opening.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Your email address" aria-label="Email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button type="submit">{subscribed ? "You’re on the list" : "Sign me up"} <ArrowUpRight size={16} /></button>
            {subscribed && <span className="newsletter-success" role="status">Saved on this device. Thanks for joining!</span>}
            {subscribeError && <span className="newsletter-success" role="alert">{subscribeError}</span>}
          </form>
        </div>
      </div>

      <div className="footer-main container">
        <div className="footer-brand">
          <Link className="footer__logo" to="/">
            <img src="/Images/REPA MARK TRANSPARENT.png" alt="" />
            <span className="brand">Repa Karisimbi</span>
          </Link>
          <p>Thoughtful technology for everyday life. Carefully selected, priced fairly, and backed by real support.</p>
          <a className="footer-whatsapp-link" href="https://wa.me/250732659689" target="_blank" rel="noreferrer">Message us on WhatsApp <ArrowUpRight size={15} /></a>
        </div>

        <div className="footer-columns">
          <div className="col">
            <h5>Explore</h5>
            <ul>
              <li><Link to="/category">Shop all</Link></li>
              <li><Link to="/category/laptops" state={{ category: "Laptops" }}>Laptops</Link></li>
              <li><Link to="/category/smartphones" state={{ category: "Smartphones" }}>Smartphones</Link></li>
              <li><Link to="/about">About Repa</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>Your account</h5>
            <ul>
              <li><Link to="/profile">My account</Link></li>
              <li><Link to="/wishlist">Saved items</Link></li>
              <li><Link to="/orders">Order history</Link></li>
              <li><Link to="/cart">Shopping cart</Link></li>
              <li><Link to="/login">Sign in</Link></li>
            </ul>
          </div>
          <div className="col col-contact">
            <h5>We&apos;re here to help</h5>
            <p>Questions about a product or order? Talk to our team.</p>
            <p><a href="tel:+250732659689">+250 732 659 689</a></p>
            <a className="live-chat" href="https://wa.me/250732659689" target="_blank" rel="noreferrer">Chat with us <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>© {new Date().getFullYear()} Repa Karisimbi. Made for everyday.</p>
          <div className="footer-bottom-links"><Link to="/about">About us</Link><Link to="/profile">Account</Link><a href="https://wa.me/250732659689" target="_blank" rel="noreferrer">Support</a></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
