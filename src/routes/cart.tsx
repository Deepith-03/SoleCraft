import { useEffect, useMemo, useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { CartItem } from "@/types/api";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { isAuthenticated, refreshCounts } = useAppContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  const isUpdatingRef = useRef<Record<number, boolean>>({});

  const loadCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    try {
      const data = await api.getCart();
      setCartItems(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    void loadCart();
  }, [isAuthenticated]);

  const subtotal = useMemo(() => cartItems.reduce((a, i) => a + i.product.price * i.quantity, 0), [cartItems]);
  const shipping = subtotal > 100 ? 0 : 12;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const setItemBusy = (itemId: number, busy: boolean) => {
    isUpdatingRef.current[itemId] = busy;
    setIsUpdating((prev) => ({ ...prev, [itemId]: busy }));
  };

  const updateQty = async (item: CartItem, nextQty: number) => {
    if (isUpdatingRef.current[item.id]) return;

    if (nextQty <= 0) {
      await removeItem(item.id);
      return;
    }

    const previousItems = cartItems;
    setItemBusy(item.id, true);
    setCartItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, quantity: nextQty } : entry))
    );

    try {
      await api.updateCartQuantity(item.id, nextQty);
      await refreshCounts();
      toast.success("Cart updated");
    } catch (err) {
      setCartItems(previousItems);
      toast.error(err instanceof Error ? err.message : "Failed to update cart");
      setError(err instanceof Error ? err.message : "Failed to update cart");
    } finally {
      setItemBusy(item.id, false);
    }
  };

  const removeItem = async (id: number) => {
    if (isUpdatingRef.current[id]) return;

    const previousItems = cartItems;
    setItemBusy(id, true);
    setCartItems((current) => current.filter((entry) => entry.id !== id));

    try {
      await api.removeCartItem(id);
      await refreshCounts();
      toast.success("Item removed from cart");
    } catch (err) {
      setCartItems(previousItems);
      toast.error(err instanceof Error ? err.message : "Failed to update cart");
      setError(err instanceof Error ? err.message : "Failed to update cart");
    } finally {
      setItemBusy(id, false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="container-page">
        <div className="page-head">
          <div className="breadcrumb"><Link to="/">Home</Link> / Cart</div>
          <h1>Your cart</h1>
          <p>{cartItems.length} items</p>
        </div>

        {!isAuthenticated ? (
          <div className="panel empty"><h3>Please login</h3><p>You need an account to manage cart items.</p><Link to="/login" className="btn btn-primary">Go to login</Link></div>
        ) : (
          <div className="layout-2col">
            <div className="panel">
              {error ? <p style={{ color: "var(--accent)" }}>{error}</p> : null}
              {cartItems.length === 0 ? (
                <div className="empty">
                  <h3>Your cart is empty</h3>
                  <p>Add a sneaker from the shop to get started.</p>
                  <Link to="/" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="line-item" key={item.id}>
                    <div className="line-item__img"><img src={item.product.image} alt={item.product.name} /></div>
                    <div>
                      <div className="line-item__brand">{item.product.brand}</div>
                      <div className="line-item__name">{item.product.name}</div>
                      <div className="line-item__meta">{item.product.color}</div>
                    </div>
                    <div className="line-item__right">
                      <div className="card__price">${(item.product.price * item.quantity).toFixed(2)}</div>
                      <div className="qty">
                        <button
                          type="button"
                          disabled={Boolean(isUpdating[item.id])}
                          onClick={() => void updateQty(item, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          disabled={Boolean(isUpdating[item.id])}
                          onClick={() => void updateQty(item, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="link-danger"
                        disabled={Boolean(isUpdating[item.id])}
                        onClick={() => void removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div>
              <div className="panel">
                <h3>Order summary</h3>
                <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
                <div className="summary-row"><span>Tax (est.)</span><span>${tax.toFixed(2)}</span></div>
                <div className="summary-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>Checkout</Link>
                <Link to="/" className="btn btn-ghost btn-block" style={{ marginTop: ".4rem" }}>Continue shopping</Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

