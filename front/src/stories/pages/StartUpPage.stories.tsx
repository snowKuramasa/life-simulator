import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import { StartUpPage } from "@/pages/StartUpPage";

const meta = {
  title: "Pages/StartUpPage",
  component: StartUpPage,
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
} satisfies Meta<typeof StartUpPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
