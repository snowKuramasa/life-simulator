import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ResidenceNewPage } from "@/pages/ResidenceNewPage";
import { ResidenceNewPageProvider } from "@/providers/pages/ResidenceNewPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderResidenceNewPage(initialEntry = "/residences/new?flow=initial") {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ResidenceNewPageProvider>
        <ResidenceNewPage />
      </ResidenceNewPageProvider>
    </MemoryRouter>,
  );
}

async function selectPrefecture(prefecture: string) {
  const trigger = screen.getByRole("combobox", { name: "場所（都道府県）" });

  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: prefecture }));
}

describe("ResidenceNewPage", () => {
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
      }),
    );
  });

  it("renders initial flow with step label and result button", () => {
    renderResidenceNewPage();

    expect(screen.getByRole("heading", { name: "住居新規作成画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "ソファに座っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByText("ステップ2/2")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "場所（都道府県）" })).toBeInTheDocument();
    expect(screen.getByText("円")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "結果を見る" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
  });

  it("renders normal create flow with back and save buttons", () => {
    renderResidenceNewPage("/residences/new");

    expect(screen.queryByText("ステップ2/2")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("submits residence create request", async () => {
    renderResidenceNewPage();

    fireEvent.change(screen.getByLabelText("住居名"), { target: { value: "候補A" } });
    fireEvent.change(screen.getByLabelText("家賃"), { target: { value: "80000" } });
    await selectPrefecture("東京都");
    fireEvent.change(screen.getByLabelText("場所（市区町村）"), { target: { value: "品川区" } });
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));

    expect(screen.getByLabelText("家賃")).toHaveValue("80,000");
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/residences",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            residence: {
              name: "候補A",
              rent: 80000,
              prefecture: "東京都",
              city: "品川区",
            },
          }),
        }),
      );
    });
    expect(await screen.findByText("住居を登録しました。結果を確認できます。")).toBeInTheDocument();
  });

  it("shows an error message when residence create fails", async () => {
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
        ok: false,
        status: 422,
      } as Response);
    });

    renderResidenceNewPage();

    fireEvent.change(screen.getByLabelText("住居名"), { target: { value: "候補A" } });
    fireEvent.change(screen.getByLabelText("家賃"), { target: { value: "80,000円" } });
    await selectPrefecture("東京都");
    fireEvent.change(screen.getByLabelText("場所（市区町村）"), { target: { value: "品川区" } });
    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));

    expect(
      await screen.findByText("住居の保存に失敗しました。入力内容を確認してもう一度お試しください。"),
    ).toBeInTheDocument();
  });
});
