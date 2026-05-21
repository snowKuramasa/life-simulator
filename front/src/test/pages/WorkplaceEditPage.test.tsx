import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WorkplaceEditPage } from "@/pages/WorkplaceEditPage";
import { WorkplaceEditPageProvider } from "@/providers/pages/WorkplaceEditPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderWorkplaceEditPage(initialEntry = "/workplaces/1/edit") {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/workplaces/:id/edit"
          element={
            <WorkplaceEditPageProvider>
              <WorkplaceEditPage />
            </WorkplaceEditPageProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

async function selectPrefecture(prefecture: string) {
  const trigger = screen.getByRole("combobox", { name: "勤務地（都道府県）" });

  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: prefecture }));
}

describe("WorkplaceEditPage", () => {
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

        if (url === "/api/v1/workplaces/1") {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              workplace: {
                id: 1,
                name: "候補A",
                salary: 220000,
                prefecture: "東京都",
                city: "品川区",
              },
            }),
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          json: async () => ({
            workplace: {
              id: 1,
              name: "候補B",
              salary: 250000,
              prefecture: "神奈川県",
              city: "横浜市",
            },
          }),
        } as Response);
      }),
    );
  });

  it("loads workplace values into the reused form", async () => {
    renderWorkplaceEditPage();

    expect(screen.getByRole("heading", { name: "勤務先編集画面" })).toBeInTheDocument();
    expect(await screen.findByDisplayValue("候補A")).toBeInTheDocument();
    expect(screen.getByLabelText("給与（手取り）")).toHaveValue("220,000");
    expect(screen.getByRole("combobox", { name: "勤務地（都道府県）" })).toHaveTextContent("東京都");
    expect(screen.getByDisplayValue("品川区")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("submits workplace update request", async () => {
    renderWorkplaceEditPage();

    await screen.findByDisplayValue("候補A");
    fireEvent.change(screen.getByLabelText("勤務先"), { target: { value: "候補B" } });
    fireEvent.change(screen.getByLabelText("給与（手取り）"), { target: { value: "250000" } });
    await selectPrefecture("神奈川県");
    fireEvent.change(screen.getByLabelText("勤務地（市区町村）"), { target: { value: "横浜市" } });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/workplaces/1",
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({
            workplace: {
              name: "候補B",
              salary: 250000,
              prefecture: "神奈川県",
              city: "横浜市",
            },
          }),
        }),
      );
    });
    expect(await screen.findByText("勤務先を保存しました。")).toBeInTheDocument();
  });
});
