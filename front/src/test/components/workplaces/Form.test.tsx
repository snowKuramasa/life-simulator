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
    expect(screen.getAllByLabelText("必須")).toHaveLength(3);
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

  it("disables submit when required fields are empty", () => {
    renderWorkplaceForm({ name: "", salary: "", prefecture: "", city: "" });

    expect(screen.getByRole("button", { name: "次へ" })).toBeDisabled();
  });

  it("allows submit when only city is empty", () => {
    renderWorkplaceForm({ city: "" });

    expect(screen.getByRole("button", { name: "次へ" })).toBeEnabled();
  });

  it("shows required error after leaving an empty field", () => {
    renderWorkplaceForm({ name: "" });

    fireEvent.blur(screen.getByLabelText("勤務先"));

    expect(screen.getByText("勤務先は必須です")).toBeInTheDocument();
  });

  it("shows salary maximum error instead of silently clamping the value", () => {
    renderWorkplaceForm({ salary: "10000001" });

    fireEvent.blur(screen.getByLabelText("給与（手取り）"));

    expect(screen.getByLabelText("給与（手取り）")).toHaveValue("10,000,001");
    expect(screen.getByText("給与（手取り）は10,000,000円以下で入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "次へ" })).toBeDisabled();
  });

  it("shows name and city length errors", () => {
    renderWorkplaceForm({ name: "あ".repeat(51), city: "い".repeat(51) });

    fireEvent.blur(screen.getByLabelText("勤務先"));
    fireEvent.blur(screen.getByLabelText("勤務地（市区町村）"));

    expect(screen.getByText("勤務先は50文字以内で入力してください")).toBeInTheDocument();
    expect(screen.getByText("勤務地（市区町村）は50文字以内で入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "次へ" })).toBeDisabled();
  });
});
