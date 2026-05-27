import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent } from "react";
import { MemoryRouter } from "react-router";

import { WorkplaceForm } from "@/components/workplaces/form";

const noop = () => {};
const preventSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

const meta = {
  title: "Components/Workplaces/Form",
  component: WorkplaceForm,
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
    title: "勤務先新規作成画面",
    formId: "storybook-workplace-form",
    name: "A社",
    setName: noop,
    salary: "220000",
    setSalary: noop,
    prefecture: "東京都",
    setPrefecture: noop,
    city: "品川区",
    setCity: noop,
    showStepLabel: true,
    submitLabel: "次へ",
    submittingLabel: "保存中...",
    isSubmitting: false,
    message: null,
    errorMessage: null,
    handleSubmit: preventSubmit,
  },
} satisfies Meta<typeof WorkplaceForm>;

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
    message: "勤務先を保存しました。",
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "勤務先の保存に失敗しました。入力内容を確認してもう一度お試しください。",
  },
};
