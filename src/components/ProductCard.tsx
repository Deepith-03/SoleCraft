import type { Product } from "@/types/api";

const fallbackBrandImages: Record<string, string> = {
  nike: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  adidas: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
  puma: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
  "new balance": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80",
  jordan: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=80",
  converse: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=900&q=80",
  reebok: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
};

const defaultShoeImage =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80";

function getFallbackImage(product: Product): string {
  const key = product.brand.toLowerCase();
  return fallbackBrandImages[key] ?? defaultShoeImage;
}

function resolveProductImage(product: Product): string {
  if (!product.image || product.image.startsWith("/assets/")) {
    return getFallbackImage(product);
  }
  return product.image;
}

export function ProductCard({
  product,
  liked = false,
  onAddToCart,
  onToggleWishlist,
  onOpenProduct,
  wishlistTooltip = "Add to favorites",
}: {
  product: Product;
  liked?: boolean;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  onOpenProduct?: (productId: number) => void;
  wishlistTooltip?: string;
}) {
  const imageSrc = resolveProductImage(product);

  return (
    <article
      className="card"
      role={onOpenProduct ? "button" : undefined}
      tabIndex={onOpenProduct ? 0 : undefined}
      onClick={() => onOpenProduct?.(product.id)}
      onKeyDown={(event) => {
        if (!onOpenProduct) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenProduct(product.id);
        }
      }}
    >
      <div className="card__media">
        {product.featured && <span className="card__tag">Featured</span>}
        <button
          type="button"
          className={`card__heart${liked ? " is-active" : ""}`}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          title={wishlistTooltip}
          onClick={(event) => {
            event.stopPropagation();
            onToggleWishlist?.(product.id);
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6.716-4.684-9.193-8.093C.803 10.092 1.05 6.107 4.41 4.2c2.3-1.305 5.113-.798 6.984 1.262a.75.75 0 0 0 1.112 0C14.377 3.402 17.19 2.895 19.49 4.2c3.36 1.907 3.607 5.892 1.603 8.707C18.716 16.316 12 21 12 21z"/></svg>
        </button>
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          onError={(event) => {
            const fallback = getFallbackImage(product);
            if (event.currentTarget.src !== fallback) {
              event.currentTarget.src = fallback;
            }
          }}
        />
      </div>
      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <h3 className="card__name">{product.name}</h3>
        <div className="line-item__meta" style={{ marginTop: 0 }}>{product.category} · {product.color} · ★ {product.rating.toFixed(1)}</div>
        <div className="card__row">
          <span className="card__price">${product.price}</span>
          <button
            type="button"
            className="card__add"
            aria-label="Add to cart"
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart?.(product.id);
            }}
            title="Add to cart"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
    </article>
  );
}
