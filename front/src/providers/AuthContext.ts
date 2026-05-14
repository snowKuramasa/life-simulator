import { createContext } from "react";

import type { AuthResponse, AuthUser, GuestLoginParams } from "@/types";

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  guestLogin: (params?: GuestLoginParams) => Promise<AuthResponse>;
  isLoggingIn: boolean;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
