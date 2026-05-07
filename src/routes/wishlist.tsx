import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SoleKraft" },
      { name: "description", content: "Your saved sneakers. Move them to your cart when you're ready." },
    ],
  }),
  component: WishlistPage,
});

const liked = [products[1], products[3]];

function WishlistPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-page">
        <div className="page-head">
          <div className="breadcrumb"><Link to="/">Home</Link> / Wishlist</div>
          <h1>Wishlist</h1>
          <p>{liked.length} pairs saved for later</p>
        </div>
        <div className="product-grid">
          {liked.map((p) => <ProductCard key={p.id} product={p} liked />)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: ".75rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          <Link to="/cart" className="btn btn-primary">Move all to cart</Link>
          <Link to="/" className="btn btn-outline">Keep shopping</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
