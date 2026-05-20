import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { WorkplaceNewPage } from "@/pages/WorkplaceNewPage";
import { AppProviders } from "@/providers/AppProviders";
import { WorkplaceNewPageProvider } from "@/providers/pages/WorkplaceNewPageProvider";

const meta = {
  title: "Pages/WorkplaceNewPage",
  component: WorkplaceNewPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WorkplaceNewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InitialFlow: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/workplaces/new?flow=initial"]}>
          <WorkplaceNewPageProvider>
            <Story />
          </WorkplaceNewPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};

export const NormalCreate: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/workplaces/new"]}>
          <WorkplaceNewPageProvider>
            <Story />
          </WorkplaceNewPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};
