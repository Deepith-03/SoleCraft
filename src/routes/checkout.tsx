import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { CartItem } from "@/types/api";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { isAuthenticated } = useAppContext();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) {
        setItems([]);
        return;
      }
      const cart = await api.getCart();
      setItems(cart);
    };
    load();
  }, [isAuthenticated]);

  const subtotal = useMemo(() => items.reduce((a, i) => a + i.product.price * i.quantity, 0), [items]);
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

        {!isAuthenticated ? (
          <div className="panel empty"><h3>Please login</h3><p>You need to login before checkout.</p><Link to="/login" className="btn btn-primary">Go to login</Link></div>
        ) : (
          <div className="layout-2col">
            <div className="panel">
              <h3>Your order</h3>
              {items.map((i) => (
                <div className="line-item" key={i.id} style={{ gridTemplateColumns: "64px 1fr auto" }}>
                  <div className="line-item__img" style={{ width: 64, height: 64 }}><img src={i.product.image} alt={i.product.name} /></div>
                  <div>
                    <div className="line-item__brand">{i.product.brand}</div>
                    <div className="line-item__name" style={{ fontSize: ".88rem" }}>{i.product.name}</div>
                    <div className="line-item__meta">Qty {i.quantity}</div>
                  </div>
                  <div className="card__price">${(i.product.price * i.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3>Order summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>Free</span></div>
              <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
              <button className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>Place order · ${total.toFixed(2)}</button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
