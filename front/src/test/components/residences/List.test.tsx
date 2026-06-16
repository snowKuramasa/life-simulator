import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { ResidenceList } from "@/components/residences/list";
import type { Residence } from "@/types";

const residences: Residence[] = [
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
    rent: 85000,
    prefecture: "東京都",
    city: "世田谷区",
  },
];

function renderResidenceList(overrides: Partial<React.ComponentProps<typeof ResidenceList>> = {}) {
  const props: React.ComponentProps<typeof ResidenceList> = {
    residences,
    isLoading: false,
    deletingId: null,
    message: null,
    errorMessage: null,
    handleDelete: vi.fn(async () => {}),
    ...overrides,
  };

  render(
    <MemoryRouter>
      <ResidenceList {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("ResidenceList", () => {
  it("renders residence cards and navigation links", () => {
    renderResidenceList();

    expect(screen.getByRole("heading", { name: "住居一覧画面" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "ソファで住宅資料を見る人のイラスト" }),
    ).toBeInTheDocument();
    expect(screen.getByText("〇〇")).toBeInTheDocument();
    expect(screen.getByText("6万円")).toBeInTheDocument();
    expect(screen.getByText("東京都杉並区")).toBeInTheDocument();
    expect(screen.getByText("85,000円")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/results");
    expect(screen.getByRole("link", { name: "住居追加" })).toHaveAttribute("href", "/residences/new");
    expect(screen.getByRole("link", { name: "〇〇を編集" })).toHaveAttribute("href", "/residences/1/edit");
  });

  it("deletes a residence after confirmation", () => {
    const handleDelete = vi.fn(async () => {});
    renderResidenceList({ handleDelete });

    fireEvent.click(screen.getByRole("button", { name: "〇〇を削除" }));
    const dialog = screen.getByRole("dialog", { name: "削除確認" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("以下のデータを削除します。よろしいですか？")).toBeInTheDocument();
    expect(within(dialog).getByText("〇〇")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it("does not delete a residence when confirmation is cancelled", () => {
    const handleDelete = vi.fn(async () => {});
    renderResidenceList({ handleDelete });

    fireEvent.click(screen.getByRole("button", { name: "〇〇を削除" }));
    fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(handleDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "削除確認" })).not.toBeInTheDocument();
  });
});
