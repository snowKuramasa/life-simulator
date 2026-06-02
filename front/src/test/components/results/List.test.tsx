import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { ResultList } from "@/components/results/list";
import type { ResultListItem } from "@/providers/pages/ResultListPageContext";

const results: ResultListItem[] = [
  {
    id: "1-1",
    workplace: {
      id: 1,
      name: "A社",
      salary: 220000,
      prefecture: "東京都",
      city: "品川区",
    },
    residence: {
      id: 1,
      name: "〇〇",
      rent: 80000,
      prefecture: "東京都",
      city: "杉並区",
    },
    commute: null,
    disposableIncome: 140000,
    status: "余裕あり",
  },
  {
    id: "2-2",
    workplace: {
      id: 2,
      name: "B社",
      salary: 180000,
      prefecture: "東京都",
      city: "新宿区",
    },
    residence: {
      id: 2,
      name: "△△",
      rent: 90000,
      prefecture: "東京都",
      city: "中野区",
    },
    commute: {
      id: 1,
      workplace_id: 2,
      residence_id: 2,
      commute_minutes: 60,
    },
    disposableIncome: 90000,
    status: "普通",
  },
];

function renderResultList() {
  render(
    <MemoryRouter>
      <ResultList
        results={results}
        sortKey="disposableIncome"
        setSortKey={vi.fn()}
        isLoading={false}
        errorMessage={null}
      />
    </MemoryRouter>,
  );
}

describe("ResultList", () => {
  it("renders result cards and list links", () => {
    renderResultList();

    expect(screen.getByRole("heading", { name: "結果一覧画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "赤い自動販売機の横に立っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "並び順" })).toHaveTextContent("並び順：残るお金");
    expect(screen.getByText("A社")).toBeInTheDocument();
    expect(screen.getByText("〇〇")).toBeInTheDocument();
    expect(screen.getAllByText("残るお金")).toHaveLength(2);
    expect(screen.getByText("14万円")).toBeInTheDocument();
    expect(screen.getByText("未入力")).toBeInTheDocument();
    expect(screen.getByText("余裕あり")).toBeInTheDocument();
    expect(screen.getByText("60分")).toBeInTheDocument();
    expect(screen.getByText("普通")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "勤務先一覧" })).toHaveAttribute("href", "/workplaces");
    expect(screen.getByRole("link", { name: "住居一覧" })).toHaveAttribute("href", "/residences");
  });
});
