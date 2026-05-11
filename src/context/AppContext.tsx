import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStorage, userStorage } from "@/services/api";
import type { AuthResponse, Role } from "@/types/api";

type AuthUser = Omit<AuthResponse, "token">;

type AppContextValue = {
  user: AuthUser | null;
  token: string | null;
  cartCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  refreshCounts: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<AuthUser | null>(() => userStorage.get());
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const isAuthenticated = Boolean(token);
  const isAdmin = user?.role === ("ADMIN" as Role);

  const refreshCounts = async () => {
    if (!token) {
      setCartCount(0);
      setWishlistCount(0);
      return;
    }

    try {
      const [cart, wishlist] = await Promise.all([api.getCartCount(), api.getWishlistCount()]);
      setCartCount(cart.count);
      setWishlistCount(wishlist.count);
    } catch {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    refreshCounts();
  }, [token]);

  const login = (data: AuthResponse) => {
    tokenStorage.set(data.token);
    userStorage.set({ userId: data.userId, username: data.username, email: data.email, role: data.role });
    setToken(data.token);
    setUser({ userId: data.userId, username: data.username, email: data.email, role: data.role });
  };

  const logout = () => {
    tokenStorage.clear();
    userStorage.clear();
    setToken(null);
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
  };

  const value = useMemo(
    () => ({ user, token, cartCount, wishlistCount, isAuthenticated, isAdmin, login, logout, refreshCounts }),
    [user, token, cartCount, wishlistCount, isAuthenticated, isAdmin]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
