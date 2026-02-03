import './App.css'

function App() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-text">REPA KALISIMBI</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero">
        <h1>Excellence in Every Venture, Impacting the Future.</h1>
        <p>
          Repa Kalisimbi Group Limited is a premier multi-sector conglomerate dedicated to providing innovative solutions and sustainable growth across Africa and beyond.
        </p>
        <button className="cta-button">Partner With Us</button>
      </header>

      {/* Services Section */}
      <section id="services" className="section">
        <h2 className="section-title">Our Expertise</h2>
        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">🏗️</span>
            <h3>Real Estate & Infrastructure</h3>
            <p>Developing modern, sustainable living and commercial spaces that redefine urban landscapes.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🌍</span>
            <h3>International Trade</h3>
            <p>Connecting global markets with high-quality commodities and seamless logistics solutions.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">💡</span>
            <h3>Consultancy & Advisory</h3>
            <p>Providing strategic insights and business solutions to help organizations scale efficiently.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <h2 className="section-title">About Our Group</h2>
        <div className="about-content">
          <p>
            Founded on the principles of integrity and innovation, Repa Kalisimbi Group Limited has grown into a diverse investment holding company. We believe in the power of synergy and long-term partnerships to create lasting value for our stakeholders and the communities we serve.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Repa Kalisimbi</h4>
            <p>Excellence. Innovation. Growth.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <p>Email: info@repakalisimbi.com</p>
            <p>Phone: +250 788 000 000</p>
            <p>Location: Kigali, Rwanda</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Repa Kalisimbi Group Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
