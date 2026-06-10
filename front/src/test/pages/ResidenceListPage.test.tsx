import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResidenceListPage } from "@/pages/ResidenceListPage";
import { ResidenceListPageProvider } from "@/providers/pages/ResidenceListPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

let residences = [
  {
    id: 1,
    name: "〇〇",
    rent: 60000,
    prefecture: "東京都",
    city: "杉並区",
  },
  {
    id: 2,
    name: "△△",
    rent: 80000,
    prefecture: "東京都",
    city: "世田谷区",
  },
];

function renderResidenceListPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/residences"]}>
      <Routes>
        <Route
          path="/residences"
          element={
            <ResidenceListPageProvider>
              <ResidenceListPage />
            </ResidenceListPageProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ResidenceListPage", () => {
  beforeEach(() => {
    residences = [
      {
        id: 1,
        name: "〇〇",
        rent: 60000,
        prefecture: "東京都",
        city: "杉並区",
      },
      {
        id: 2,
        name: "△△",
        rent: 80000,
        prefecture: "東京都",
        city: "世田谷区",
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn((input, init) => {
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

        if (url === "/api/v1/residences" && !init?.method) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ residences }),
          } as Response);
        }

        if (url === "/api/v1/residences/1" && init?.method === "DELETE") {
          residences = residences.filter((residence) => residence.id !== 1);

          return Promise.resolve({
            ok: true,
            text: async () => "",
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 404,
        } as Response);
      }),
    );
  });

  it("loads residences from API", async () => {
    renderResidenceListPage();

    expect(await screen.findByText("〇〇")).toBeInTheDocument();
    expect(screen.getByText("△△")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/results");
    expect(screen.getByRole("link", { name: "住居追加" })).toHaveAttribute("href", "/residences/new");
    expect(screen.getByRole("link", { name: "〇〇を編集" })).toHaveAttribute("href", "/residences/1/edit");
  });

  it("deletes a residence through API", async () => {
    renderResidenceListPage();

    await screen.findByText("〇〇");
    fireEvent.click(screen.getByRole("button", { name: "〇〇を削除" }));
    expect(screen.getByRole("dialog", { name: "削除確認" })).toBeInTheDocument();
    expect(screen.getByText("以下のデータを削除します。よろしいですか？")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/residences/1",
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        }),
      );
    });
    expect(await screen.findByText("住居を削除しました。")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("〇〇")).not.toBeInTheDocument();
    });
  });
});
