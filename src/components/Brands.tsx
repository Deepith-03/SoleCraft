import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { Product, WishlistItem } from "@/types/api";

const BRANDS = ["Nike", "Adidas", "Puma", "Jordan", "Reebok", "Converse", "New Balance"];

export function Brands() {
  const { isAuthenticated, refreshCounts } = useAppContext();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState<string>("Nike");
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        // Uses the backend search parameter which maps to brand/name/category
        const data = await api.getProducts({ search: selectedBrand });
        // Let's filter client-side just in case backend search matches too broadly (e.g. name containing 'Nike')
        const exactBrandMatch = data.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
        setProducts(exactBrandMatch.slice(0, 8)); // Display up to 8
      } catch (err) {
        console.error("Failed to load brand products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBrandProducts();
  }, [selectedBrand]);

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
    const data = await api.getWishlist();
    setWishlist(data);
    await refreshCounts();
  };

  const openProduct = (productId: number) => {
    navigate({ to: "/product/$id", params: { id: String(productId) } });
  };

  return (
    <section id="brands" className="container-page section" style={{ scrollMarginTop: "80px" }}>
      <div className="section__head" style={{ marginBottom: "2rem" }}>
        <div>
          <h2>Shop by Brand</h2>
          <p>Explore our curated selection from top sneaker manufacturers.</p>
        </div>
      </div>
      
      <div className="brands-list">
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={`brand-pill ${selectedBrand === brand ? "is-active" : ""}`}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className="product-grid" style={{ marginTop: "2.5rem", minHeight: "350px" }}>
        {loading ? (
           <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
             Loading {selectedBrand} sneakers...
           </div>
        ) : products.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--muted-foreground)" }}>
             No {selectedBrand} sneakers currently in stock.
          </div>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              liked={wishlistIds.has(p.id)}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              onOpenProduct={openProduct}
              wishlistTooltip={isAuthenticated ? "Add to favorites" : "Login to add favorites"}
            />
          ))
        )}
      </div>
    </section>
  );
}
