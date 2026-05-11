import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { Product, WishlistItem } from "@/types/api";

export function NewDrops() {
  const { isAuthenticated, refreshCounts } = useAppContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewDrops = async () => {
      try {
        setLoading(true);
        // Fetch all products (without pagination) and filter
        const allProducts = await api.getProducts();
        
        // Filter for featured products
        const featured = allProducts.filter((p) => p.featured);
        
        // If we have featured products, show up to 4 of them. 
        // Otherwise, show the 4 newest (simulated by last added or first 4).
        if (featured.length > 0) {
          setProducts(featured.slice(0, 4));
        } else {
          setProducts(allProducts.slice(-4).reverse());
        }
      } catch (err) {
        console.error("Failed to load new drops", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewDrops();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api.getWishlist();
        setWishlist(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const wishlistIds = new Set(wishlist.map((item) => item.product.id));

  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.hash } });
      return;
    }
    await api.addToCart(productId);
    await refreshCounts();
  };

  const handleToggleWishlist = async (productId: number) => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.hash } });
      return;
    }
    const existing = wishlist.find((item) => item.product.id === productId);
    if (existing) {
      await api.removeFromWishlist(existing.id);
    } else {
      await api.addToWishlist(productId);
    }
    // Re-fetch wishlist for local state
    const data = await api.getWishlist();
    setWishlist(data);
    await refreshCounts();
  };

  const openProduct = (productId: number) => {
    navigate({ to: "/product/$id", params: { id: String(productId) } });
  };

  if (loading) return null; // Or a loading skeleton
  if (products.length === 0) return null;

  return (
    <section id="new" className="container-page section" style={{ scrollMarginTop: "80px" }}>
      <div className="section__head">
        <div>
          <h2>New Drops</h2>
          <p>Hand-picked silhouettes fresh off the line.</p>
        </div>
        <a href="#shop" className="btn btn-outline btn-sm" style={{ alignSelf: "center" }}>View All</a>
      </div>
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
    </section>
  );
}
