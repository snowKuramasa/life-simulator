import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { WorkplaceListPage } from "@/pages/WorkplaceListPage";
import { AppProviders } from "@/providers/AppProviders";
import { WorkplaceListPageProvider } from "@/providers/pages/WorkplaceListPageProvider";

const meta = {
  title: "Pages/WorkplaceListPage",
  component: WorkplaceListPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkplaceListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/workplaces"]}>
          <WorkplaceListPageProvider>
            <Story />
          </WorkplaceListPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};
