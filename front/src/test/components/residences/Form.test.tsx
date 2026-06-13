import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps, type FormEvent } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { ResidenceForm } from "@/components/residences/form";

type ResidenceFormProps = ComponentProps<typeof ResidenceForm>;

function renderResidenceForm(overrides: Partial<ResidenceFormProps> = {}) {
  const handleSubmit = vi.fn(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  });
  const props: ResidenceFormProps = {
    title: "住居新規作成画面",
    formId: "residence-form",
    name: "候補A",
    setName: vi.fn(),
    rent: "80000",
    setRent: vi.fn(),
    prefecture: "東京都",
    setPrefecture: vi.fn(),
    city: "品川区",
    setCity: vi.fn(),
    showStepLabel: true,
    submitLabel: "結果を見る",
    submittingLabel: "保存中...",
    isSubmitting: false,
    message: null,
    errorMessage: null,
    handleSubmit,
    ...overrides,
  };

  render(
    <MemoryRouter>
      <ResidenceForm {...props} />
    </MemoryRouter>,
  );

  return props;
}

describe("ResidenceForm", () => {
  it("renders residence fields and initial flow controls", () => {
    renderResidenceForm();

    expect(screen.getByRole("heading", { name: "住居新規作成画面" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "ソファに座っている人のイラスト" })).toBeInTheDocument();
    expect(screen.getByText("ステップ2/2")).toBeInTheDocument();
    expect(screen.getByLabelText("住居名")).toHaveValue("候補A");
    expect(screen.getByLabelText("家賃")).toHaveValue("80,000");
    expect(screen.getByRole("combobox", { name: "場所（都道府県）" })).toHaveTextContent("東京都");
    expect(screen.getByLabelText("場所（市区町村）")).toHaveValue("品川区");
    expect(screen.getAllByLabelText("必須")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "戻る" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "結果を見る" })).toBeInTheDocument();
  });

  it("normalizes rent input before passing it to setter", () => {
    const setRent = vi.fn();
    renderResidenceForm({ setRent });

    fireEvent.change(screen.getByLabelText("家賃"), { target: { value: "90,000円" } });

    expect(setRent).toHaveBeenCalledWith("90000");
  });

  it("submits through the external submit button", () => {
    const handleSubmit = vi.fn(async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    renderResidenceForm({ handleSubmit });

    fireEvent.click(screen.getByRole("button", { name: "結果を見る" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables submit when required fields are empty", () => {
    renderResidenceForm({ name: "", rent: "", prefecture: "", city: "" });

    expect(screen.getByRole("button", { name: "結果を見る" })).toBeDisabled();
  });

  it("allows submit when only city is empty", () => {
    renderResidenceForm({ city: "" });

    expect(screen.getByRole("button", { name: "結果を見る" })).toBeEnabled();
  });

  it("shows required error after leaving an empty field", () => {
    renderResidenceForm({ name: "" });

    fireEvent.blur(screen.getByLabelText("住居名"));

    expect(screen.getByText("住居名は必須です")).toBeInTheDocument();
  });

  it("shows rent maximum error instead of silently clamping the value", () => {
    renderResidenceForm({ rent: "1000001" });

    fireEvent.blur(screen.getByLabelText("家賃"));

    expect(screen.getByLabelText("家賃")).toHaveValue("1,000,001");
    expect(screen.getByText("家賃は1,000,000円以下で入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "結果を見る" })).toBeDisabled();
  });

  it("shows name and city length errors", () => {
    renderResidenceForm({ name: "あ".repeat(51), city: "い".repeat(51) });

    fireEvent.blur(screen.getByLabelText("住居名"));
    fireEvent.blur(screen.getByLabelText("場所（市区町村）"));

    expect(screen.getByText("住居名は50文字以内で入力してください")).toBeInTheDocument();
    expect(screen.getByText("場所（市区町村）は50文字以内で入力してください")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "結果を見る" })).toBeDisabled();
  });
});
