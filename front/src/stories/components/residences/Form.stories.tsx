import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent } from "react";
import { MemoryRouter } from "react-router";

import { ResidenceForm } from "@/components/residences/form";

const noop = () => {};
const preventSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

const meta = {
  title: "Components/Residences/Form",
  component: ResidenceForm,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    title: "住居新規作成画面",
    formId: "storybook-residence-form",
    name: "候補A",
    setName: noop,
    rent: "80000",
    setRent: noop,
    prefecture: "東京都",
    setPrefecture: noop,
    city: "品川区",
    setCity: noop,
    showStepLabel: true,
    submitLabel: "結果を見る",
    submittingLabel: "保存中...",
    isSubmitting: false,
    message: null,
    errorMessage: null,
    handleSubmit: preventSubmit,
  },
} satisfies Meta<typeof ResidenceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InitialFlow: Story = {};

export const NormalCreate: Story = {
  args: {
    showStepLabel: false,
    submitLabel: "保存",
  },
};

export const WithMessage: Story = {
  args: {
    message: "住居を登録しました。結果を確認できます。",
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "住居の保存に失敗しました。入力内容を確認してもう一度お試しください。",
  },
};
