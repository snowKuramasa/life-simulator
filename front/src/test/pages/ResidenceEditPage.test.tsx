import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResidenceEditPage } from "@/pages/ResidenceEditPage";
import { ResidenceEditPageProvider } from "@/providers/pages/ResidenceEditPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderResidenceEditPage(initialEntry = "/residences/1/edit") {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/residences/:id/edit"
          element={
            <ResidenceEditPageProvider>
              <ResidenceEditPage />
            </ResidenceEditPageProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

async function selectPrefecture(prefecture: string) {
  const trigger = screen.getByRole("combobox", { name: "場所（都道府県）" });

  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: prefecture }));
}

describe("ResidenceEditPage", () => {
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

        if (url === "/api/v1/residences/1") {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              residence: {
                id: 1,
                name: "候補A",
                rent: 80000,
                prefecture: "東京都",
                city: "品川区",
              },
            }),
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          json: async () => ({
            residence: {
              id: 1,
              name: "候補B",
              rent: 90000,
              prefecture: "神奈川県",
              city: "横浜市",
            },
          }),
        } as Response);
      }),
    );
  });

  it("loads residence values into the reused form", async () => {
    renderResidenceEditPage();

    expect(screen.getByRole("heading", { name: "住居編集画面" })).toBeInTheDocument();
    expect(await screen.findByDisplayValue("候補A")).toBeInTheDocument();
    expect(screen.getByLabelText("家賃")).toHaveValue("80,000");
    expect(screen.getByRole("combobox", { name: "場所（都道府県）" })).toHaveTextContent("東京都");
    expect(screen.getByDisplayValue("品川区")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("submits residence update request", async () => {
    renderResidenceEditPage();

    await screen.findByDisplayValue("候補A");
    fireEvent.change(screen.getByLabelText("住居名"), { target: { value: "候補B" } });
    fireEvent.change(screen.getByLabelText("家賃"), { target: { value: "90000" } });
    await selectPrefecture("神奈川県");
    fireEvent.change(screen.getByLabelText("場所（市区町村）"), { target: { value: "横浜市" } });
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/residences/1",
        expect.objectContaining({
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify({
            residence: {
              name: "候補B",
              rent: 90000,
              prefecture: "神奈川県",
              city: "横浜市",
            },
          }),
        }),
      );
    });
    expect(await screen.findByText("住居を保存しました。")).toBeInTheDocument();
  });
});
