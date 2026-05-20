import { fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WorkplaceNewPage } from "@/pages/WorkplaceNewPage";
import { WorkplaceNewPageProvider } from "@/providers/pages/WorkplaceNewPageProvider";
import { renderWithProviders } from "@/test/utils/renderWithProviders";

function renderWorkplaceNewPage(initialEntry = "/workplaces/new?flow=initial") {
  return renderWithProviders(
    <MemoryRouter initialEntries={[initialEntry]}>
      <WorkplaceNewPageProvider>
        <WorkplaceNewPage />
      </WorkplaceNewPageProvider>
    </MemoryRouter>,
  );
}

async function selectPrefecture(prefecture: string) {
  const trigger = screen.getByRole("combobox", { name: "勤務地（都道府県）" });

  trigger.focus();
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("option", { name: prefecture }));
}

describe("WorkplaceNewPage", () => {
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
            workplace: {
              id: 1,
              name: "候補A",
              salary: 220000,
              prefecture: "東京都",
              city: "品川区",
            },
          }),
        } as Response);
      }),
    );
  });

  it("renders initial flow with step label and next button", () => {
    renderWorkplaceNewPage();

    expect(screen.getByRole("heading", { name: "勤務先新規作成画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "駅の改札に立っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByText("ステップ1/2")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "勤務地（都道府県）" })).toBeInTheDocument();
    expect(screen.getByText("円")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "次へ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
  });

  it("renders normal create flow with back and save buttons", () => {
    renderWorkplaceNewPage("/workplaces/new");

    expect(screen.queryByText("ステップ1/2")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("submits workplace create request", async () => {
    renderWorkplaceNewPage();

    fireEvent.change(screen.getByLabelText("勤務先"), { target: { value: "候補A" } });
    fireEvent.change(screen.getByLabelText("給与（手取り）"), { target: { value: "220000" } });
    await selectPrefecture("東京都");
    fireEvent.change(screen.getByLabelText("勤務地（市区町村）"), { target: { value: "品川区" } });
    fireEvent.click(screen.getByRole("button", { name: "次へ" }));

    expect(screen.getByLabelText("給与（手取り）")).toHaveValue("220,000");
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/v1/workplaces",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            workplace: {
              name: "候補A",
              salary: 220000,
              prefecture: "東京都",
              city: "品川区",
            },
          }),
        }),
      );
    });
    expect(await screen.findByText("勤務先を登録しました。次の入力へ進めます。")).toBeInTheDocument();
  });

  it("shows an error message when workplace create fails", async () => {
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

    renderWorkplaceNewPage();

    fireEvent.change(screen.getByLabelText("勤務先"), { target: { value: "候補A" } });
    fireEvent.change(screen.getByLabelText("給与（手取り）"), { target: { value: "220,000円" } });
    await selectPrefecture("東京都");
    fireEvent.change(screen.getByLabelText("勤務地（市区町村）"), { target: { value: "品川区" } });
    fireEvent.click(screen.getByRole("button", { name: "次へ" }));

    expect(
      await screen.findByText("勤務先の保存に失敗しました。入力内容を確認してもう一度お試しください。"),
    ).toBeInTheDocument();
  });
});
