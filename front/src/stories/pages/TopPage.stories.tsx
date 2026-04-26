import type { Meta, StoryObj } from "@storybook/react-vite";

import { TopPage } from "@/pages/TopPage";

const meta = {
  title: "Pages/TopPage",
  component: TopPage,
  tags: ["autodocs"],
} satisfies Meta<typeof TopPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
