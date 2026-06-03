import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ResultListPage } from "@/pages/ResultListPage";
import { ResultListPageProvider } from "@/providers/pages/ResultListPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderResultListPage() {
  return renderWithProviders(
    <MemoryRouter initialEntries={["/results"]}>
      <Routes>
        <Route
          path="/results"
          element={
            <ResultListPageProvider>
              <ResultListPage />
            </ResultListPageProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ResultListPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input) => {
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

        if (url === "/api/v1/workplaces") {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              workplaces: [
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
              ],
            }),
          } as Response);
        }

        if (url === "/api/v1/residences") {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              residences: [
                {
                  id: 1,
                  name: "〇〇",
                  rent: 80000,
                  prefecture: "東京都",
                  city: "杉並区",
                },
                {
                  id: 2,
                  name: "△△",
                  rent: 90000,
                  prefecture: "東京都",
                  city: "中野区",
                },
              ],
            }),
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          json: async () => ({
            commutes: [
              {
                id: 1,
                workplace_id: 2,
                residence_id: 2,
                commute_minutes: 60,
              },
            ],
          }),
        } as Response);
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loads result combinations from API", async () => {
    renderResultListPage();

    expect(await screen.findAllByText("A社")).toHaveLength(2);
    expect(screen.getAllByText("〇〇")).toHaveLength(2);
    expect(screen.getAllByText("通勤時間を入力")).toHaveLength(3);
    expect(screen.getByText("60分")).toBeInTheDocument();
    expect(screen.getAllByText("余裕あり")).toHaveLength(3);
    expect(screen.getByText("普通")).toBeInTheDocument();
  });

  it("sorts results by commute minutes", async () => {
    renderResultListPage();

    expect(await screen.findAllByText("A社")).toHaveLength(2);
    const trigger = screen.getByRole("combobox", { name: "並び順" });

    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.click(await screen.findByRole("option", { name: "通勤時間が短い順" }));

    const cards = screen.getAllByRole("article");
    expect(within(cards[0]).getByText("B社")).toBeInTheDocument();
    expect(within(cards[0]).getByText("△△")).toBeInTheDocument();
    expect(within(cards[0]).getByText("60分")).toBeInTheDocument();
  });

  it("creates commute minutes from a result card", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    renderResultListPage();

    fireEvent.click(await screen.findByRole("button", { name: "A社と〇〇の通勤時間を編集" }));
    const input = screen.getByRole("spinbutton", { name: "A社と〇〇の通勤時間" });

    fireEvent.change(input, { target: { value: "45" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/commutes",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            commute: {
              workplace_id: 1,
              residence_id: 1,
              commute_minutes: 45,
            },
          }),
        }),
      );
    });
    expect(await screen.findByLabelText("保存しました")).toBeInTheDocument();

    vi.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(screen.queryByLabelText("保存しました")).not.toBeInTheDocument();
    });
  });
});
