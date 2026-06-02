import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ResultListPage } from "@/pages/ResultListPage";
import { AppProviders } from "@/providers/AppProviders";
import { ResultListPageProvider } from "@/providers/pages/ResultListPageProvider";

const meta = {
  title: "Pages/ResultListPage",
  component: ResultListPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ResultListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/results"]}>
          <ResultListPageProvider>
            <Story />
          </ResultListPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};
