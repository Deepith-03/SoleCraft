export type Role = "ADMIN" | "CUSTOMER";

export type UserProfile = {
  userId: number;
  username: string;
  email: string;
  role: Role;
};

export type AuthResponse = {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: Role;
};

export type Product = {
  id: number;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  image: string;
  color: string;
  stockQuantity: number;
  featured: boolean;
  rating: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export type WishlistItem = {
  id: number;
  product: Product;
};

export type ProductInput = Omit<Product, "id">;
