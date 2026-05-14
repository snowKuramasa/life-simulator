import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginPage } from "@/pages/LoginPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderLoginPage() {
  return renderWithProviders(
    <MemoryRouter>
      <LoginPageProvider>
        <LoginPage />
      </LoginPageProvider>
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input) => {
        const url = String(input);

        if (url === "/api/v1/auth/me") {
          return Promise.resolve({
            ok: false,
            status: 401,
          });
        }

        return Promise.resolve({
          ok: true,
          json: async () => ({
            authenticated: true,
            user: {
              id: 1,
              name: "テストゲスト",
              provider: "guest",
              guest: true,
            },
          }),
        });
      }),
    );
  });

  it("renders login page", async () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: "ログイン画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "座って猫を抱いている人のイラスト" })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Googleでログイン（準備中）" })).toBeDisabled();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "ゲストで続ける" })).toBeInTheDocument();
  });

  it("submits guest login request", async () => {
    renderLoginPage();

    fireEvent.change(await screen.findByLabelText("名前"), {
      target: { value: "テストゲスト" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ゲストで続ける" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/auth/guest",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ name: "テストゲスト" }),
        }),
      );
    });
    expect(await screen.findByText("お帰りなさい テストゲスト さん")).toBeInTheDocument();
  });

  it("shows welcome message instead of login form when already authenticated", async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/me") {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            authenticated: true,
            user: {
              id: 1,
              name: "テストゲスト",
              provider: "guest",
              guest: true,
            },
          }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
      } as Response);
    });

    renderLoginPage();

    expect(await screen.findByText("お帰りなさい テストゲスト さん")).toBeInTheDocument();
    expect(screen.queryByLabelText("名前")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Googleでログイン（準備中）" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "ゲストで続ける" })).toHaveAttribute("href", "/");
  });

  it("shows an error message when guest login fails", async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/me") {
        return Promise.resolve({
          ok: false,
          status: 401,
        } as Response);
      }

      return Promise.resolve({
        ok: false,
        status: 500,
      } as Response);
    });

    renderLoginPage();
    fireEvent.click(await screen.findByRole("button", { name: "ゲストで続ける" }));

    expect(
      await screen.findByText("ゲストログインに失敗しました。時間をおいてもう一度お試しください。"),
    ).toBeInTheDocument();
  });
});
