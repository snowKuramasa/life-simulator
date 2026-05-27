import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ResidenceNewPage } from "@/pages/ResidenceNewPage";
import { AppProviders } from "@/providers/AppProviders";
import { ResidenceNewPageProvider } from "@/providers/pages/ResidenceNewPageProvider";

const meta = {
  title: "Pages/ResidenceNewPage",
  component: ResidenceNewPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ResidenceNewPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InitialFlow: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/residences/new?flow=initial"]}>
          <ResidenceNewPageProvider>
            <Story />
          </ResidenceNewPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};

export const NormalCreate: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/residences/new"]}>
          <ResidenceNewPageProvider>
            <Story />
          </ResidenceNewPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};
