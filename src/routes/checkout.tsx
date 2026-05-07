import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { products } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SoleKraft" },
      { name: "description", content: "Complete your sneaker order securely." },
    ],
  }),
  component: CheckoutPage,
});

const items = [
  { product: products[0], qty: 1 },
  { product: products[2], qty: 2 },
  { product: products[4], qty: 1 },
];

function CheckoutPage() {
  const subtotal = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  return (
    <>
      <SiteHeader />
      <main className="container-page">
        <div className="page-head">
          <div className="breadcrumb"><Link to="/">Home</Link> / <Link to="/cart">Cart</Link> / Checkout</div>
          <h1>Checkout</h1>
          <p>Almost there — fill in your details below.</p>
        </div>

        <div className="layout-2col">
          <div>
            <div className="panel">
              <h3>Contact</h3>
              <div className="form-grid">
                <div className="field full"><label>Email</label><input placeholder="you@example.com" /></div>
              </div>
            </div>
            <div className="panel">
              <h3>Shipping address</h3>
              <div className="form-grid">
                <div className="field"><label>First name</label><input placeholder="Alex" /></div>
                <div className="field"><label>Last name</label><input placeholder="Morgan" /></div>
                <div className="field full"><label>Street address</label><input placeholder="123 Maple Avenue" /></div>
                <div className="field"><label>City</label><input placeholder="Brooklyn" /></div>
                <div className="field"><label>ZIP code</label><input placeholder="11201" /></div>
                <div className="field"><label>Country</label><input placeholder="United States" /></div>
                <div className="field"><label>Phone</label><input placeholder="(555) 010-1234" /></div>
              </div>
            </div>
            <div className="panel">
              <h3>Payment</h3>
              <div className="pay-options">
                <label className="pay-option is-selected">
                  <span><strong>Credit / debit card</strong><small>Visa, Mastercard, Amex</small></span>
                  <span>●●●●</span>
                </label>
                <label className="pay-option">
                  <span><strong>PayPal</strong><small>You'll be redirected to confirm</small></span>
                  <span>↗</span>
                </label>
                <label className="pay-option">
                  <span><strong>Apple Pay</strong><small>Available on supported devices</small></span>
                  <span>⌘</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="panel">
              <h3>Your order</h3>
              {items.map((i) => (
                <div className="line-item" key={i.product.id} style={{ gridTemplateColumns: "64px 1fr auto" }}>
                  <div className="line-item__img" style={{ width: 64, height: 64 }}><img src={i.product.image} alt={i.product.name} /></div>
                  <div>
                    <div className="line-item__brand">{i.product.brand}</div>
                    <div className="line-item__name" style={{ fontSize: ".88rem" }}>{i.product.name}</div>
                    <div className="line-item__meta">Qty {i.qty}</div>
                  </div>
                  <div className="card__price">${i.product.price * i.qty}</div>
                </div>
              ))}
              <div style={{ marginTop: "1rem" }}>
                <div className="summary-row"><span>Subtotal</span><span>${subtotal}</span></div>
                <div className="summary-row"><span>Shipping</span><span>Free</span></div>
                <div className="summary-row"><span>Tax</span><span>${tax}</span></div>
                <div className="summary-row total"><span>Total</span><span>${total}</span></div>
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>Place order · ${total}</button>
              <p style={{ color: "var(--muted-foreground)", fontSize: ".78rem", marginTop: ".75rem", textAlign: "center" }}>By placing this order you agree to our terms.</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
