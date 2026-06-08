import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { WorkplaceList } from "@/components/workplaces/list";
import type { Workplace } from "@/types";

const workplaces: Workplace[] = [
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
    salary: 185000,
    prefecture: "東京都",
    city: "新宿区",
  },
];

function renderWorkplaceList(overrides: Partial<React.ComponentProps<typeof WorkplaceList>> = {}) {
  const props: React.ComponentProps<typeof WorkplaceList> = {
    workplaces,
    isLoading: false,
    deletingId: null,
    message: null,
    errorMessage: null,
    handleDelete: vi.fn(async () => {}),
    ...overrides,
  };

  render(
    <MemoryRouter>
      <WorkplaceList {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("WorkplaceList", () => {
  it("renders workplace cards and navigation links", () => {
    renderWorkplaceList();

    expect(screen.getByRole("heading", { name: "勤務先一覧画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "駅の改札に立っている人のイラスト" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "並び順：手取り" })).not.toBeInTheDocument();
    expect(screen.getByText("A社")).toBeInTheDocument();
    expect(screen.getByText("22万円")).toBeInTheDocument();
    expect(screen.getByText("東京都品川区")).toBeInTheDocument();
    expect(screen.getByText("185,000円")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/results");
    expect(screen.getByRole("link", { name: "勤務先追加" })).toHaveAttribute("href", "/workplaces/new");
    expect(screen.getByRole("link", { name: "A社を編集" })).toHaveAttribute("href", "/workplaces/1/edit");
  });

  it("deletes a workplace after confirmation", () => {
    const handleDelete = vi.fn(async () => {});
    renderWorkplaceList({ handleDelete });

    fireEvent.click(screen.getByRole("button", { name: "A社を削除" }));
    const dialog = screen.getByRole("dialog", { name: "削除確認" });
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("以下のデータを削除します。よろしいですか？")).toBeInTheDocument();
    expect(within(dialog).getByText("A社")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it("does not delete a workplace when confirmation is cancelled", () => {
    const handleDelete = vi.fn(async () => {});
    renderWorkplaceList({ handleDelete });

    fireEvent.click(screen.getByRole("button", { name: "A社を削除" }));
    fireEvent.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(handleDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog", { name: "削除確認" })).not.toBeInTheDocument();
  });
});
