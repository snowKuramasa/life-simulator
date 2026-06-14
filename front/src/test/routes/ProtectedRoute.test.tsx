import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { AuthContextValue } from "@/providers/AuthContext";
import { AuthContext } from "@/providers/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const baseAuthValue = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: false,
  guestLogin: vi.fn(),
  isLoggingIn: false,
  logout: vi.fn(),
  isLoggingOut: false,
} satisfies AuthContextValue;

function renderProtectedRoute(authValue: AuthContextValue) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={["/results"]}>
        <Routes>
          <Route path="/login" element={<p>ログイン画面です</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/results" element={<p>結果画面です</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading status while checking authentication", () => {
    renderProtectedRoute({
      ...baseAuthValue,
      isAuthLoading: true,
    });

    expect(screen.getByRole("status")).toHaveTextContent("確認中...");
    expect(screen.queryByText("結果画面です")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    renderProtectedRoute(baseAuthValue);

    expect(screen.getByText("ログイン画面です")).toBeInTheDocument();
    expect(screen.queryByText("結果画面です")).not.toBeInTheDocument();
  });

  it("renders protected content when authenticated", () => {
    renderProtectedRoute({
      ...baseAuthValue,
      user: {
        id: 1,
        name: "テストゲスト",
        provider: "guest",
        guest: true,
      },
      isAuthenticated: true,
    });

    expect(screen.getByText("結果画面です")).toBeInTheDocument();
    expect(screen.queryByText("ログイン画面です")).not.toBeInTheDocument();
  });
});
