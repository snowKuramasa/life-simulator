import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ResidenceList } from "@/components/residences/list";

const meta = {
  title: "Components/Residences/List",
  component: ResidenceList,
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
    residences: [
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
        rent: 80000,
        prefecture: "東京都",
        city: "世田谷区",
      },
    ],
    isLoading: false,
    deletingId: null,
    message: null,
    errorMessage: null,
    handleDelete: async () => {},
  },
} satisfies Meta<typeof ResidenceList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    residences: [],
  },
};

export const WithMessage: Story = {
  args: {
    message: "住居を削除しました。",
  },
};
