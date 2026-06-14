import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginPage } from "@/pages/LoginPage";
import { LoginPageProvider } from "@/providers/pages/LoginPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderLoginPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPageProvider>
              <LoginPage />
            </LoginPageProvider>
          }
        />
        <Route path="/workplaces/new" element={<p>勤務先新規作成画面へ遷移しました</p>} />
        <Route path="/residences/new" element={<p>住居新規作成画面へ遷移しました</p>} />
        <Route path="/results" element={<p>結果一覧画面へ遷移しました</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input) => {
        const url = String(input);

        if (url === "/api/v1/auth/session") {
          return Promise.resolve({
            ok: false,
            status: 401,
          });
        }

        if (url === "/api/v1/auth/guest") {
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
              first_login: true,
            }),
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
    expect(screen.getByText("※ゲストデータはCookieで管理されます。")).toBeInTheDocument();
    expect(
      screen.getByText("下記操作時は同じデータを扱うことができません。"),
    ).toBeInTheDocument();
    expect(screen.getByText("・Cookie削除")).toBeInTheDocument();
    expect(screen.getByText("・別ブラウザ利用")).toBeInTheDocument();
    expect(screen.getByText("・シークレットウィンドウ終了")).toBeInTheDocument();
    expect(screen.getByText("データは削除されることがあります。")).toBeInTheDocument();
  });

  it("does not show the guest continue action while checking authentication", () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/session") {
        return new Promise(() => undefined);
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
      } as Response);
    });

    renderLoginPage();

    expect(screen.getByText("確認中...")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ゲストで続ける" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "ゲストで続ける" })).not.toBeInTheDocument();
  });

  it("submits guest login request and navigates to initial workplace step on first login", async () => {
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
    expect(await screen.findByText("勤務先新規作成画面へ遷移しました")).toBeInTheDocument();
  });

  it("navigates to results after guest login when the user has logged in before", async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/session") {
        return Promise.resolve({
          ok: false,
          status: 401,
        } as Response);
      }

      if (url === "/api/v1/auth/guest") {
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
            first_login: false,
          }),
        } as Response);
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
      } as Response);
    });

    renderLoginPage();
    fireEvent.click(await screen.findByRole("button", { name: "ゲストで続ける" }));

    expect(await screen.findByText("結果一覧画面へ遷移しました")).toBeInTheDocument();
  });

  it("shows welcome message instead of login form when already authenticated", async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/session") {
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
    });

    renderLoginPage();

    expect(await screen.findByText("お帰りなさい テストゲスト さん")).toBeInTheDocument();
    expect(screen.queryByLabelText("名前")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Googleでログイン（準備中）" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "ゲストで続ける" })).toHaveAttribute("href", "/results");
    });
  });

  it("shows an error message when guest login fails", async () => {
    vi.mocked(fetch).mockImplementation((input) => {
      const url = String(input);

      if (url === "/api/v1/auth/session") {
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

  it("shows guest name length error", async () => {
    renderLoginPage();

    fireEvent.change(await screen.findByLabelText("名前"), {
      target: { value: "あ".repeat(51) },
    });
    fireEvent.blur(screen.getByLabelText("名前"));

    expect(screen.getByText("名前は50文字以内で入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ゲストで続ける" })).toBeDisabled();
  });
});
