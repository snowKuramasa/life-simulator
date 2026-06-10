import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ResultList } from "@/components/results/list";

const meta = {
  title: "Components/Results/List",
  component: ResultList,
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
    results: [
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
        monthlySurplus: -10000,
        status: "普通",
      },
    ],
    sortKey: "monthlySurplus",
    setSortKey: () => {},
    householdSize: "single",
    setHouseholdSize: () => {},
    commuteSaveStatuses: {},
    saveCommuteMinutes: async () => true,
    isLoading: false,
    errorMessage: null,
  },
} satisfies Meta<typeof ResultList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    results: [],
  },
};
