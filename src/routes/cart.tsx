import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { products } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — SoleKraft" },
      { name: "description", content: "Review the sneakers in your cart and proceed to checkout." },
    ],
  }),
  component: CartPage,
});

const cartItems = [
  { product: products[0], qty: 1, size: "US 10" },
  { product: products[2], qty: 2, size: "US 9" },
  { product: products[4], qty: 1, size: "US 11" },
];

function CartPage() {
  const subtotal = cartItems.reduce((a, i) => a + i.product.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  return (
    <>
      <SiteHeader />
      <main className="container-page">
        <div className="page-head">
          <div className="breadcrumb"><Link to="/">Home</Link> / Cart</div>
          <h1>Your cart</h1>
          <p>{cartItems.length} items · Free shipping unlocked</p>
        </div>
        <div className="layout-2col">
          <div className="panel">
            {cartItems.map((item) => (
              <div className="line-item" key={item.product.id}>
                <div className="line-item__img"><img src={item.product.image} alt={item.product.name} /></div>
                <div>
                  <div className="line-item__brand">{item.product.brand}</div>
                  <div className="line-item__name">{item.product.name}</div>
                  <div className="line-item__meta">{item.size} · {item.product.color}</div>
                </div>
                <div className="line-item__right">
                  <div className="card__price">${item.product.price * item.qty}</div>
                  <div className="qty"><button>−</button><span>{item.qty}</span><button>+</button></div>
                  <button className="link-danger">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="panel">
              <h3>Order summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="summary-row"><span>Tax (est.)</span><span>${tax}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total}</span></div>
              <div className="promo">
                <input placeholder="Promo code" />
                <button className="btn btn-outline btn-sm">Apply</button>
              </div>
              <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>Checkout</Link>
              <Link to="/" className="btn btn-ghost btn-block" style={{ marginTop: ".4rem" }}>Continue shopping</Link>
            </div>
            <div className="panel">
              <h3>Why shop with us</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: ".88rem", lineHeight: 1.6 }}>Free returns within 30 days. Authenticity verified on every pair. Carbon-neutral delivery worldwide.</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
