import type { ReactNode } from "react";

import {
  useCurrentUserQuery,
  useGuestLoginMutation,
  useLogoutMutation,
} from "@/hooks/auth/useAuthQueries";
import { AuthContext } from "@/providers/AuthContext";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const currentUserQuery = useCurrentUserQuery();
  const guestLoginMutation = useGuestLoginMutation();
  const logoutMutation = useLogoutMutation();
  const authResponse = currentUserQuery.data;

  return (
    <AuthContext.Provider
      value={{
        user: authResponse?.user ?? null,
        isAuthenticated: authResponse?.authenticated ?? false,
        isAuthLoading: currentUserQuery.isLoading,
        guestLogin: guestLoginMutation.mutateAsync,
        isLoggingIn: guestLoginMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
