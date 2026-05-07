import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import hero from "@/assets/hero-sneaker.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SoleKraft — Curated Sneakers for the Everyday" },
      { name: "description", content: "Shop the latest sneakers from Air Jordan, Nike, Adidas and more. Free shipping over $100." },
      { property: "og:title", content: "SoleKraft — Curated Sneakers" },
      { property: "og:description", content: "Curated sneakers built for comfort, designed for the street." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="container-page hero">
          <div>
            <span className="eyebrow"><span className="dot" /> Spring 2026 collection</span>
            <h1>Step into your <em>signature</em> stride.</h1>
            <p>Hand-picked silhouettes from the world's best makers. Premium materials, honest pricing, and shipping that actually shows up.</p>
            <div className="hero__cta">
              <a href="#shop" className="btn btn-primary">Shop the drop</a>
              <a href="#story" className="btn btn-outline">Our story</a>
            </div>
            <div className="hero__stats">
              <div><span>120+</span><small>Curated styles</small></div>
              <div><span>48h</span><small>Express delivery</small></div>
              <div><span>4.9★</span><small>From 12k reviews</small></div>
            </div>
          </div>
          <div className="hero__media">
            <img src={hero} alt="Featured sneaker" width={1280} height={960} />
            <div className="hero__tag"><small>Featured</small>Air Jordan 1 'Shadow' · $180</div>
          </div>
        </section>

        <section id="shop" className="container-page section">
          <div className="section__head">
            <div>
              <h2>Latest drops</h2>
              <p>Fresh in this week — limited stock on every pair.</p>
            </div>
            <div className="searchbar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
              <span>Search sneakers, brands, colors…</span>
            </div>
          </div>
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="pagination">
            <button>‹</button>
            <button className="is-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>›</button>
          </div>
        </section>

        <section id="story" className="container-page section">
          <div className="features">
            <div className="feature"><h4>Free shipping over $100</h4><p>Every order ships carbon-neutral with tracked delivery in 2–4 business days.</p></div>
            <div className="feature"><h4>30-day easy returns</h4><p>Try them at home. Don't love them? Send them back for a full refund — no questions asked.</p></div>
            <div className="feature"><h4>Authenticity guaranteed</h4><p>Every pair is verified by our in-house experts before it leaves the warehouse.</p></div>
          </div>
        </section>

        <section className="container-page section" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)", marginBottom: ".5rem" }}>Ready to lace up?</h2>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "1.25rem" }}>Browse the full catalog or jump straight to checkout.</p>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/cart" className="btn btn-primary">View cart</Link>
            <Link to="/wishlist" className="btn btn-outline">My wishlist</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
