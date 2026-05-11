import type { AuthResponse, CartItem, Product, ProductInput, WishlistItem } from "@/types/api";

const API_BASE_URL = "http://localhost:8082/api";
const TOKEN_KEY = "sneakerhead_token";
const USER_KEY = "sneakerhead_user";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function buildHeaders(hasBody = false): HeadersInit {
  const headers: HeadersInit = {};
  const token = getToken();

  if (hasBody) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const tokenStorage = {
  set(token: string) {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
  },
  get: getToken,
  clear() {
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
  },
};

export const userStorage = {
  set(user: Omit<AuthResponse, "token">) {
    if (typeof window !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  get() {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as Omit<AuthResponse, "token">) : null;
  },
  clear() {
    if (typeof window !== "undefined") localStorage.removeItem(USER_KEY);
  },
};

export const api = {
  register(payload: { username: string; email: string; password: string }) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
  },

  login(payload: { email: string; password: string }) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
  },

  getProducts(params?: { search?: string; page?: number; size?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page !== undefined) query.set("page", String(params.page));
    if (params?.size !== undefined) query.set("size", String(params.size));
    const suffix = query.toString() ? `?${query}` : "";
    return request<Product[]>(`/products${suffix}`);
  },

  getProductById(id: number) {
    return request<Product>(`/products/${id}`);
  },

  getCart() {
    return request<CartItem[]>("/cart", { headers: buildHeaders() });
  },

  addToCart(productId: number) {
    return request<CartItem>(`/cart/${productId}`, { method: "POST", headers: buildHeaders() });
  },

  updateCartQuantity(cartItemId: number, quantity: number) {
    return request<CartItem>(`/cart/${cartItemId}?quantity=${quantity}`, {
      method: "PUT",
      headers: buildHeaders(),
    });
  },

  removeFromCart(cartItemId: number) {
    return request<void>(`/cart/${cartItemId}`, { method: "DELETE", headers: buildHeaders() });
  },

  removeCartItem(cartItemId: number) {
    return request<void>(`/cart/${cartItemId}`, { method: "DELETE", headers: buildHeaders() });
  },

  getCartCount() {
    return request<{ count: number }>("/cart/count", { headers: buildHeaders() });
  },

  getWishlist() {
    return request<WishlistItem[]>("/wishlist", { headers: buildHeaders() });
  },

  addToWishlist(productId: number) {
    return request<WishlistItem>(`/wishlist/${productId}`, { method: "POST", headers: buildHeaders() });
  },

  removeFromWishlist(wishlistItemId: number) {
    return request<void>(`/wishlist/${wishlistItemId}`, { method: "DELETE", headers: buildHeaders() });
  },

  async removeFromWishlistByProductId(productId: number) {
    const wishlist = await request<WishlistItem[]>("/wishlist", { headers: buildHeaders() });
    const item = wishlist.find((entry) => entry.product.id === productId);
    if (!item) return;
    return request<void>(`/wishlist/${item.id}`, { method: "DELETE", headers: buildHeaders() });
  },

  getWishlistCount() {
    return request<{ count: number }>("/wishlist/count", { headers: buildHeaders() });
  },

  createProduct(payload: ProductInput) {
    return request<Product>("/admin/products", {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
  },

  updateProduct(id: number, payload: ProductInput) {
    return request<Product>(`/admin/products/${id}`, {
      method: "PUT",
      headers: buildHeaders(true),
      body: JSON.stringify(payload),
    });
  },

  deleteProduct(id: number) {
    return request<void>(`/admin/products/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  },
};
