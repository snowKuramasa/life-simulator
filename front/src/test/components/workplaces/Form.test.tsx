import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps, type FormEvent } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { WorkplaceForm } from "@/components/workplaces/form";

type WorkplaceFormProps = ComponentProps<typeof WorkplaceForm>;

function renderWorkplaceForm(overrides: Partial<WorkplaceFormProps> = {}) {
  const handleSubmit = vi.fn(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  });
  const props: WorkplaceFormProps = {
    title: "勤務先新規作成画面",
    formId: "workplace-form",
    name: "A社",
    setName: vi.fn(),
    salary: "220000",
    setSalary: vi.fn(),
    prefecture: "東京都",
    setPrefecture: vi.fn(),
    city: "品川区",
    setCity: vi.fn(),
    showStepLabel: true,
    submitLabel: "次へ",
    submittingLabel: "保存中...",
    isSubmitting: false,
    message: null,
    errorMessage: null,
    handleSubmit,
    ...overrides,
  };

  render(
    <MemoryRouter>
      <WorkplaceForm {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("WorkplaceForm", () => {
  it("renders workplace fields and initial flow controls", () => {
    renderWorkplaceForm();

    expect(screen.getByRole("heading", { name: "勤務先新規作成画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "駅の改札に立っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByText("ステップ1/2")).toBeInTheDocument();
    expect(screen.getByLabelText("勤務先")).toHaveValue("A社");
    expect(screen.getByLabelText("給与（手取り）")).toHaveValue("220,000");
    expect(screen.getByRole("combobox", { name: "勤務地（都道府県）" })).toHaveTextContent("東京都");
    expect(screen.getByLabelText("勤務地（市区町村）")).toHaveValue("品川区");
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "次へ" })).toBeInTheDocument();
  });

  it("normalizes salary input before passing it to setter", () => {
    const setSalary = vi.fn();
    renderWorkplaceForm({ setSalary });

    fireEvent.change(screen.getByLabelText("給与（手取り）"), { target: { value: "230,000円" } });

    expect(setSalary).toHaveBeenCalledWith("230000");
  });

  it("submits through the external submit button", () => {
    const handleSubmit = vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    renderWorkplaceForm({ handleSubmit });

    fireEvent.click(screen.getByRole("button", { name: "次へ" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
