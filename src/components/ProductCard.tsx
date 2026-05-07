import type { Product } from "@/lib/products";

export function ProductCard({ product, liked = false }: { product: Product; liked?: boolean }) {
  return (
    <article className="card">
      <div className="card__media">
        {product.tag && <span className="card__tag">{product.tag}</span>}
        <button className={`card__heart${liked ? " is-active" : ""}`} aria-label="Add to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src={product.image} alt={product.name} loading="lazy" width={800} height={800} />
      </div>
      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <h3 className="card__name">{product.name}</h3>
        <div className="card__row">
          <span className="card__price">${product.price}</span>
          <button className="card__add" aria-label="Add to cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          </button>
        </div>
      </div>
    </article>
  );
}
