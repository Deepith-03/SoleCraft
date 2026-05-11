import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { api } from "@/services/api";
import type { Product, WishlistItem } from "@/types/api";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetailsPage,
});

const sizeOptions = ["US 7", "US 8", "US 9", "US 10", "US 11"];

function ProductDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { isAuthenticated, refreshCounts } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[2]);

  const parsedId = Number(id);

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
    const loadProduct = async () => {
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        setError("Invalid product id.");
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [selected, allProducts] = await Promise.all([api.getProductById(parsedId), api.getProducts({ size: 100 })]);
        setProduct(selected);
        setProducts(allProducts);
        setError("");
      } catch (err) {
        setProduct(null);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [parsedId]);

  useEffect(() => {
    void loadWishlist();
  }, [isAuthenticated]);

  const wishlistItem = useMemo(
    () => wishlist.find((entry) => entry.product.id === product?.id),
    [wishlist, product?.id]
  );
  const isWishlisted = Boolean(wishlistItem);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (item) =>
          item.id !== product.id && (item.brand.toLowerCase() === product.brand.toLowerCase() || item.category === product.category)
      )
      .slice(0, 4);
  }, [products, product]);

  const addToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.search + window.location.hash } });
      return;
    }

    try {
      await Promise.all(Array.from({ length: quantity }, () => api.addToCart(product.id)));
      await refreshCounts();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: window.location.pathname + window.location.search + window.location.hash } });
      return;
    }

    try {
      if (wishlistItem) {
        await api.removeFromWishlist(wishlistItem.id);
        toast.success("Removed from wishlist");
      } else {
        await api.addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
      await loadWishlist();
      await refreshCounts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update wishlist");
    }
  };

  const openProduct = (productId: number) => {
    navigate({ to: "/product/$id", params: { id: String(productId) } });
  };

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="container-page product-details-page">
          <div className="panel empty">
            <h3>Loading product...</h3>
            <p>Hang tight while we pull the latest sneaker details.</p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <SiteHeader />
        <main className="container-page product-details-page">
          <div className="panel empty">
            <h3>Product unavailable</h3>
            <p>{error || "This product could not be found."}</p>
            <Link to="/" className="btn btn-primary">
              Back to shop
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container-page product-details-page">
        <div className="page-head">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>{product.brand}</span> / <span>{product.name}</span>
          </div>
          <h1>{product.name}</h1>
          <p>Engineered comfort, all-day support, and premium street-ready style.</p>
        </div>

        <section className="product-showcase">
          <div className="product-showcase__media">
            {product.featured ? <span className="product-showcase__featured">Featured</span> : null}
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-showcase__info">
            <div className="product-meta">
              <span className="eyebrow">
                <span className="dot" />
                {product.brand}
              </span>
              <span className="product-rating">★ {product.rating.toFixed(1)}</span>
            </div>

            <div className="product-price">${product.price.toFixed(2)}</div>
            <p className="product-description">{product.description}</p>

            <div className="product-info-grid">
              <div><span>Category</span><strong>{product.category}</strong></div>
              <div><span>Color</span><strong>{product.color}</strong></div>
              <div>
                <span>Stock</span>
                <strong className={product.stockQuantity > 0 ? "in-stock" : "out-of-stock"}>
                  {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                </strong>
              </div>
              <div><span>Selected size</span><strong>{selectedSize}</strong></div>
            </div>

            <div>
              <p className="product-subtitle">Available sizes</p>
              <div className="size-list">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-chip${selectedSize === size ? " is-active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-wrap">
              <p className="product-subtitle">Quantity</p>
              <div className="qty qty-lg">
                <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((prev) => prev + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button type="button" className="btn btn-primary" onClick={addToCart} disabled={product.stockQuantity <= 0}>
                Add To Cart
              </button>
              <button
                type="button"
                className={`btn btn-outline wishlist-btn${isWishlisted ? " is-active" : ""}`}
                onClick={toggleWishlist}
              >
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
              <button
                type="button"
                className="btn btn-accent buy-now-btn"
                onClick={() => navigate({ to: "/checkout" })}
                disabled={product.stockQuantity <= 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__head">
            <div>
              <h2>Related sneakers</h2>
              <p>More picks in the same family.</p>
            </div>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="product-grid">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  liked={wishlist.some((entry) => entry.product.id === item.id)}
                  onAddToCart={async (productId) => {
                    try {
                      await api.addToCart(productId);
                      await refreshCounts();
                      toast.success("Added to cart");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
                    }
                  }}
                  onToggleWishlist={async (productId) => {
                    if (!isAuthenticated) {
                      navigate({
                        to: "/login",
                        search: { redirect: window.location.pathname + window.location.search + window.location.hash },
                      });
                      return;
                    }
                    try {
                      const existing = wishlist.find((entry) => entry.product.id === productId);
                      if (existing) {
                        await api.removeFromWishlist(existing.id);
                        toast.success("Removed from wishlist");
                      } else {
                        await api.addToWishlist(productId);
                        toast.success("Added to wishlist");
                      }
                      await loadWishlist();
                      await refreshCounts();
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to update wishlist");
                    }
                  }}
                  onOpenProduct={openProduct}
                />
              ))}
            </div>
          ) : (
            <div className="panel empty">
              <h3>No related sneakers yet</h3>
              <p>Explore more styles from the catalog.</p>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
