import { FormEvent, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { api } from "@/services/api";
import { useAppContext } from "@/context/AppContext";
import type { Product, ProductInput } from "@/types/api";

const emptyForm: ProductInput = {
  name: "",
  brand: "",
  description: "",
  category: "",
  price: 0,
  image: "/assets/nike-air-max-270.svg",
  color: "",
  stockQuantity: 0,
  featured: false,
  rating: 4,
};

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await api.updateProduct(editingId, form);
        toast.success("Product updated successfully");
      } else {
        await api.createProduct(form);
        toast.success("Product added successfully");
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const edit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      color: product.color,
      stockQuantity: product.stockQuantity,
      featured: product.featured,
      rating: product.rating,
    });
  };

  const handleDeleteClick = (product: Product) => {
    setConfirmDelete(product);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteProduct = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete.id;
    const productName = confirmDelete.name;

    // Close modal immediately
    setConfirmDelete(null);
    setDeletingId(id);

    // Optimistic UI: remove from state instantly
    const previousProducts = products;
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await api.deleteProduct(id);
      toast.success(`"${productName}" deleted successfully`);
    } catch (err) {
      // Revert on failure
      setProducts(previousProducts);
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <>
        <SiteHeader />
        <main className="container-page section"><div className="panel empty"><h3>Access denied</h3><p>Admin privileges are required.</p></div></main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="container-page section">
        <h1 style={{ marginBottom: "1rem" }}>Admin Dashboard</h1>
        <div className="layout-2col" style={{ paddingTop: 0 }}>
          <div className="panel">
            <h3>{editingId ? "Edit product" : "Add product"}</h3>
            <form onSubmit={submit} className="form-grid">
              <div className="field"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="field"><label>Brand</label><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required /></div>
              <div className="field full"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
              <div className="field"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
              <div className="field"><label>Color</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required /></div>
              <div className="field"><label>Price</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required /></div>
              <div className="field"><label>Stock</label><input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} required /></div>
              <div className="field"><label>Rating</label><input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} required /></div>
              <div className="field"><label>Image path</label><input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required /></div>
              <div className="field" style={{ justifyContent: "end" }}><label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label></div>
              <div className="full" style={{ display: "flex", gap: ".75rem" }}>
                <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update" : "Add"} Product</button>
                {editingId ? <button className="btn btn-outline" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button> : null}
              </div>
            </form>
          </div>

          <div className="panel">
            <h3>Inventory ({products.length})</h3>
            <div style={{ maxHeight: "680px", overflowY: "auto" }}>
              {products.map((p) => (
                <div key={p.id} className="line-item admin-line-item" style={{ gridTemplateColumns: "64px 1fr auto" }}>
                  <div className="line-item__img" style={{ width: 64, height: 64 }}><img src={p.image} alt={p.name} /></div>
                  <div>
                    <div className="line-item__name">{p.name}</div>
                    <div className="line-item__meta">{p.brand} · ${p.price} · Stock {p.stockQuantity}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                    <button className="btn btn-outline btn-sm" onClick={() => edit(p)}>Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={deletingId === p.id}
                      onClick={() => handleDeleteClick(p)}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={cancelDelete}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </div>
            <h3 style={{ margin: ".75rem 0 .35rem", fontSize: "1.1rem" }}>Delete Product</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: ".9rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Are you sure you want to delete <strong style={{ color: "var(--foreground)" }}>"{confirmDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
              <button className="btn btn-outline btn-sm" onClick={cancelDelete}>Cancel</button>
              <button className="btn btn-sm btn-danger" onClick={confirmDeleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  );
}

