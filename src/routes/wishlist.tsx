import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { WishlistItem } from "@/types/api";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const { isAuthenticated, refreshCounts } = useAppContext();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const loadWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    const data = await api.getWishlist();
    setWishlist(data);
  };

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  const remove = async (itemId: number) => {
    await api.removeFromWishlist(itemId);
    await loadWishlist();
    await refreshCounts();
  };

  const moveToCart = async (item: WishlistItem) => {
    await api.addToCart(item.product.id);
    await api.removeFromWishlist(item.id);
    await loadWishlist();
    await refreshCounts();
  };

  const openProduct = (productId: number) => {
    navigate({ to: "/product/$id", params: { id: String(productId) } });
  };

  return (
    <>
      <SiteHeader />
      <main className="container-page">
        <div className="page-head">
          <div className="breadcrumb"><Link to="/">Home</Link> / Wishlist</div>
          <h1>Wishlist</h1>
          <p>{wishlist.length} pairs saved for later</p>
        </div>

        {!isAuthenticated ? (
          <div className="panel empty"><h3>Please login</h3><p>You need an account to manage wishlist items.</p><Link to="/login" className="btn btn-primary">Go to login</Link></div>
        ) : (
          <>
            <div className="product-grid">
              {wishlist.map((item) => (
                <div key={item.id}>
                  <ProductCard
                    product={item.product}
                    liked
                    onAddToCart={() => moveToCart(item)}
                    onToggleWishlist={() => remove(item.id)}
                    onOpenProduct={openProduct}
                  />
                </div>
              ))}
            </div>
            {wishlist.length === 0 ? <div className="panel empty"><h3>No wishlist items</h3><p>Save products to review them later.</p></div> : null}
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
