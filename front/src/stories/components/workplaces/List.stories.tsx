import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { WorkplaceList } from "@/components/workplaces/list";

const meta = {
  title: "Components/Workplaces/List",
  component: WorkplaceList,
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
    workplaces: [
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
        salary: 180000,
        prefecture: "東京都",
        city: "新宿区",
      },
    ],
    isLoading: false,
    deletingId: null,
    message: null,
    errorMessage: null,
    handleDelete: async () => {},
  },
} satisfies Meta<typeof WorkplaceList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    workplaces: [],
  },
};

export const WithMessage: Story = {
  args: {
    message: "勤務先を削除しました。",
  },
};
