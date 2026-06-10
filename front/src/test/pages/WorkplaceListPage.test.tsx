import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WorkplaceListPage } from "@/pages/WorkplaceListPage";
import { WorkplaceListPageProvider } from "@/providers/pages/WorkplaceListPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

let workplaces = [
  {
    id: 1,
    name: "A社",
    salary: 220000,
    prefecture: "東京都",
    city: "品川区",
  },
  {
    id: 2,
    name: "B社",
    salary: 180000,
    prefecture: "東京都",
    city: "新宿区",
  },
];

function renderWorkplaceListPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/workplaces"]}>
      <Routes>
        <Route
          path="/workplaces"
          element={
            <WorkplaceListPageProvider>
              <WorkplaceListPage />
            </WorkplaceListPageProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WorkplaceListPage", () => {
  beforeEach(() => {
    workplaces = [
      {
        id: 1,
        name: "A社",
        salary: 220000,
        prefecture: "東京都",
        city: "品川区",
      },
      {
        id: 2,
        name: "B社",
        salary: 180000,
        prefecture: "東京都",
        city: "新宿区",
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

        if (url === "/api/v1/workplaces" && !init?.method) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ workplaces }),
          } as Response);
        }

        if (url === "/api/v1/workplaces/1" && init?.method === "DELETE") {
          workplaces = workplaces.filter((workplace) => workplace.id !== 1);

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

  it("loads workplaces from API", async () => {
    renderWorkplaceListPage();

    expect(await screen.findByText("A社")).toBeInTheDocument();
    expect(screen.getByText("B社")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/results");
    expect(screen.getByRole("link", { name: "勤務先追加" })).toHaveAttribute("href", "/workplaces/new");
    expect(screen.getByRole("link", { name: "A社を編集" })).toHaveAttribute("href", "/workplaces/1/edit");
  });

  it("deletes a workplace through API", async () => {
    renderWorkplaceListPage();

    await screen.findByText("A社");
    fireEvent.click(screen.getByRole("button", { name: "A社を削除" }));
    expect(screen.getByRole("dialog", { name: "削除確認" })).toBeInTheDocument();
    expect(screen.getByText("以下のデータを削除します。よろしいですか？")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/workplaces/1",
        expect.objectContaining({
          method: "DELETE",
          credentials: "include",
        }),
      );
    });
    expect(await screen.findByText("勤務先を削除しました。")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("A社")).not.toBeInTheDocument();
    });
  });
});
