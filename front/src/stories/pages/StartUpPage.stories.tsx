import type { Meta, StoryObj } from "@storybook/react-vite";

import { StartUpPage } from "@/pages/StartUpPage";

const meta = {
  title: "Pages/StartUpPage",
  component: StartUpPage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof StartUpPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
