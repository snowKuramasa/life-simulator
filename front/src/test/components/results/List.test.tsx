import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    monthlySurplus: 0,
    status: "ぎりぎり",
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
    monthlySurplus: -10000,
    status: "生活費不足",
  },
];

function renderResultList(
  overrides: Partial<React.ComponentProps<typeof ResultList>> = {},
) {
  const props: React.ComponentProps<typeof ResultList> = {
    results,
    sortKey: "monthlySurplus",
    setSortKey: vi.fn(),
    householdSize: "single",
    setHouseholdSize: vi.fn(),
    commuteSaveStatuses: {},
    saveCommuteMinutes: vi.fn(async () => true),
    isLoading: false,
    errorMessage: null,
    ...overrides,
  };

  render(
    <MemoryRouter>
      <ResultList {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("ResultList", () => {
  it("renders result cards and list links", () => {
    renderResultList();

    expect(screen.getByRole("heading", { name: "結果一覧画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "赤い自動販売機の横に立っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByText("世帯人数")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "世帯人数" })).toHaveTextContent("1人");
    expect(screen.getByText("並び順")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "並び順" })).toHaveTextContent("月の収支がよい順");
    expect(screen.getByText("A社")).toBeInTheDocument();
    expect(screen.getByText("〇〇")).toBeInTheDocument();
    expect(screen.getAllByText("月の収支")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /月の収支の説明/ })).toHaveLength(2);
    expect(
      screen.getAllByText(
        "手取り月収から家賃と標準生活費14万円を引いた目安です。マイナスは、その生活費をまかなうには足りない金額です。",
      ),
    ).toHaveLength(2);
    expect(screen.getByText("0円")).toBeInTheDocument();
    expect(screen.getByText("1万円不足")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "A社と〇〇の片道通勤時間を編集" })).toHaveTextContent(
      "片道通勤時間を入力",
    );
    expect(screen.getByText("ぎりぎり")).toBeInTheDocument();
    expect(screen.getByText("生活費不足")).toBeInTheDocument();
    expect(screen.getByText("片道60分")).toBeInTheDocument();
    expect(screen.getByText("往復120分")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "勤務先一覧" })).toHaveAttribute("href", "/workplaces");
    expect(screen.getByRole("link", { name: "住居一覧" })).toHaveAttribute("href", "/residences");
  });

  it("edits commute minutes inline", async () => {
    const saveCommuteMinutes = vi.fn(async () => true);
    renderResultList({ saveCommuteMinutes });

    fireEvent.click(screen.getByRole("button", { name: "A社と〇〇の片道通勤時間を編集" }));
    const input = screen.getByRole("spinbutton", { name: "A社と〇〇の片道通勤時間" });

    fireEvent.change(input, { target: { value: "45" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(saveCommuteMinutes).toHaveBeenCalledWith(results[0], 45);
    });
  });

  it("shows commute save status icons", () => {
    renderResultList({ commuteSaveStatuses: { "1-1": "success" } });

    expect(screen.getByLabelText("保存しました")).toBeInTheDocument();
  });
});
