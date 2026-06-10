import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { ResidenceListPage } from "@/pages/ResidenceListPage";
import { AppProviders } from "@/providers/AppProviders";
import { ResidenceListPageProvider } from "@/providers/pages/ResidenceListPageProvider";

const meta = {
  title: "Pages/ResidenceListPage",
  component: ResidenceListPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ResidenceListPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <AppProviders>
        <MemoryRouter initialEntries={["/residences"]}>
          <ResidenceListPageProvider>
            <Story />
          </ResidenceListPageProvider>
        </MemoryRouter>
      </AppProviders>
    ),
  ],
};
