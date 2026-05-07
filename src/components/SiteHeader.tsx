import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container-page site-header__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">SK</span>
          <span>SoleKraft</span>
        </Link>
        <nav className="nav">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "is-active" }}>Shop</Link>
          <a href="/#new">New Drops</a>
          <a href="/#brands">Brands</a>
          <a href="/#story">Story</a>
        </nav>
        <div className="header-actions">
          <button className="icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span className="badge">2</span>
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
            <span className="badge">3</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-page">
        <div className="site-footer__grid">
          <div>
            <Link to="/" className="brand"><span className="brand__mark">SK</span><span>SoleKraft</span></Link>
            <p style={{ marginTop: ".75rem", maxWidth: "32ch" }}>Curated sneakers for the everyday wearer. Built for comfort, designed for the street.</p>
          </div>
          <div>
            <h5>Shop</h5>
            <ul><li><a href="#">New arrivals</a></li><li><a href="#">Best sellers</a></li><li><a href="#">Sale</a></li></ul>
          </div>
          <div>
            <h5>Help</h5>
            <ul><li><a href="#">Shipping</a></li><li><a href="#">Returns</a></li><li><a href="#">Size guide</a></li></ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul><li><a href="#">About</a></li><li><a href="#">Press</a></li><li><a href="#">Contact</a></li></ul>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 SoleKraft. All rights reserved.</span>
          <span>Built with care.</span>
        </div>
      </div>
    </footer>
  );
}
