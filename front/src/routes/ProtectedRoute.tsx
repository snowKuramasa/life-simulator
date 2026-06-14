import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <p role="status" aria-live="polite">
        確認中...
      </p>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}
