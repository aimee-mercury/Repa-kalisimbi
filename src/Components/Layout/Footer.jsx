import React from "react";
import "../../Styles/Footer.scss";

const Footer = () => {
	return (
		<footer className="site-footer">
			<div className="footer-newsletter">
				<div className="container footer-newsletter__inner">
					<div className="newsletter-text">
						<h3>Sign Up for Newsletter</h3>
						<p>Subscribe to get information about products and coupons.</p>
					</div>

					<form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
						<input
							type="email"
							placeholder="Enter your email address"
							aria-label="email"
						/>
						<button type="submit">Subscribe</button>
					</form>
				</div>
			</div>

			<div className="footer-main container">
				<div className="footer-brand">
                   <div className="footer__logo">

          <span className="brand">Repa Technology</span>
        </div>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
						dignissim neque condimentum lacus dapibus.
					</p>
					<div className="socials">
						<a href="#" aria-label="facebook" className="social-link">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.34 2 2 6.48 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H8.9v-2.9h1.54V9.41c0-1.52.9-2.37 2.29-2.37.66 0 1.35.12 1.35.12v1.49h-.76c-.75 0-.98.47-.98.95v1.14h1.67l-.27 2.9h-1.4v7.03C18.34 21.25 22 17.09 22 12.07z" />
							</svg>
						</a>
						<a href="#" aria-label="twitter" className="social-link">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path d="M22 5.92c-.63.28-1.3.48-2 .57.72-.43 1.27-1.1 1.53-1.9-.68.4-1.44.7-2.25.86C18.9 4.6 17.85 4 16.67 4c-1.66 0-3 1.34-3 3 0 .24.03.48.08.71C10.03 7.57 6.13 5.5 3.2 2.36c-.27.47-.43 1.02-.43 1.6 0 1.1.56 2.07 1.4 2.64-.52-.02-1.02-.16-1.45-.4v.04c0 1.54 1.09 2.82 2.54 3.11-.27.07-.55.11-.84.11-.21 0-.41-.02-.6-.06.41 1.28 1.6 2.21 3.02 2.24-1.11.86-2.5 1.37-4.01 1.37-.26 0-.52-.01-.77-.04 1.43.92 3.12 1.46 4.94 1.46 5.93 0 9.18-4.91 9.18-9.17v-.42c.63-.45 1.17-1.02 1.6-1.66-.58.26-1.2.44-1.85.52z" />
							</svg>
						</a>
						<a href="#" aria-label="instagram" className="social-link">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</a>
						<a href="#" aria-label="linkedin" className="social-link">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
								<path d="M20 3H4c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1zM8.5 18H6v-7h2.5v7zM7.25 9.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM18 18h-2.5v-3.5c0-.94-.6-1.5-1.4-1.5-.76 0-1.4.52-1.4 1.5V18H10V11h2.4v1.05c.36-.6 1.08-1.05 1.98-1.05 1.7 0 2.62 1.12 2.62 3.02V18z" />
							</svg>
						</a>
					</div>
				</div>

				<div className="footer-columns">
					<div className="col">
						<h5>Quick Links</h5>
						<ul>
							<li><a href="#">About Us</a></li>
							<li><a href="#">Contact</a></li>
							<li><a href="#">Products</a></li>
							<li><a href="#">Login</a></li>
						</ul>
					</div>

					<div className="col">
						<h5>Customer Area</h5>
						<ul>
							<li><a href="#">My Account</a></li>
							<li><a href="#">Orders</a></li>
							<li><a href="#">Tracking ID</a></li>
							<li><a href="#">Privacy Policy</a></li>
						</ul>
					</div>

					<div className="col col-contact">
						<h5>Contact</h5>
						<p>Call us: +1 234 567 890</p>
						<p>Email: support@example.com</p>
						<button className="live-chat">Live Chat</button>
						<div className="app-badges">
							<a href="#" className="appstore">App Store</a>
							<a href="#" className="playstore">Google Play</a>
						</div>
					</div>
				</div>
			</div>

			<div className="footer-bottom">
				<div className="container">
					<p>© {new Date().getFullYear()} Repa Technology. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
