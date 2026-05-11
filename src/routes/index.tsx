import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import { NewDrops } from "@/components/NewDrops";
import { Brands } from "@/components/Brands";
import type { Product, WishlistItem } from "@/types/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { isAuthenticated, refreshCounts } = useAppContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");

  const pageSize = 8;

  const loadProducts = async () => {
    try {
      const data = await api.getProducts({ search: search || undefined, page, size: pageSize });
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    }
  };

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const data = await api.getWishlist();
      setWishlist(data);
    } catch {
      setWishlist([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, page]);

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  const wishlistIds = useMemo(() => new Set(wishlist.map((item) => item.product.id)), [wishlist]);

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.search + window.location.hash } });
      return;
    }
    await api.addToCart(productId);
    await refreshCounts();
  };

  const handleToggleWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.search + window.location.hash } });
      return;
    }

    const existing = wishlist.find((item) => item.product.id === productId);
    if (existing) {
      await api.removeFromWishlist(existing.id);
    } else {
      await api.addToWishlist(productId);
    }

    await loadWishlist();
    await refreshCounts();
  };

  const openProduct = (productId: number) => {
    navigate({ to: "/product/$id", params: { id: String(productId) } });
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="container-page hero">
          <div>
            <span className="eyebrow"><span className="dot" /> Spring 2026 collection</span>
            <h1>Step into your <em>signature</em> stride.</h1>
            <p>Hand-picked silhouettes from the world's best makers with real-time inventory and authenticated shopping.</p>
            <div className="hero__cta">
              <a href="#new" className="btn btn-primary">Shop the drop</a>
              <a href="#story" className="btn btn-outline">Our story</a>
            </div>
            <div className="hero__stats">
              <div><span>20+</span><small>Sneakers in stock</small></div>
              <div><span>2</span><small>User roles</small></div>
              <div><span>4.8★</span><small>Top rated pairs</small></div>
            </div>
          </div>
          <div className="hero__media hero__media--interactive">
            <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1400&q=80" alt="Featured sneaker" width={1280} height={960} />
            <div className="hero__overlay">
              <div className="hero__overlay-content">
                <span className="hero__overlay-label">Limited Edition Drop</span>
                <h3 className="hero__overlay-title">Air Jordan 1 Retro High</h3>
                <p className="hero__overlay-desc">Engineered for speed and comfort. Iconic style meets modern performance.</p>
                <a href="#new" className="btn btn-accent btn-sm">Shop Now</a>
              </div>
            </div>
            <div className="hero__tag"><small>Featured</small>Air Jordan 1 Retro High · $179.99</div>
          </div>
        </section>

        {/* New Drops Section */}
        <NewDrops />

        {/* Brands Section */}
        <Brands />

        {/* All Products Section */}
        <section id="shop" className="container-page section" style={{ scrollMarginTop: "80px" }}>
          <div className="section__head">
            <div>
              <h2>All Sneaker Catalog</h2>
              <p>Fresh in this week with backend-powered search and pagination.</p>
            </div>
            <div className="searchbar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                style={{ border: "none", background: "transparent", width: "100%", outline: "none" }}
                placeholder="Search sneakers, brands, categories..."
                value={search}
                onChange={(e) => {
                  setPage(0);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
          {error ? <p style={{ color: "var(--accent)" }}>{error}</p> : null}
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                liked={wishlistIds.has(p.id)}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onOpenProduct={openProduct}
                wishlistTooltip={isAuthenticated ? "Add to favorites" : "Login to add favorites"}
              />
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => setPage((prev) => Math.max(0, prev - 1))}>‹</button>
            <button className="is-active">{page + 1}</button>
            <button onClick={() => setPage((prev) => prev + 1)}>›</button>
          </div>
          {!isAuthenticated ? (
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--muted-foreground)" }}>
              <Link to="/login">Login</Link> to add products to cart and wishlist.
            </p>
          ) : null}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
