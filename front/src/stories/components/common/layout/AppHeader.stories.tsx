import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader } from "@/components/common/layout/AppHeader";

const meta = {
  title: "Components/Common/Layout/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    appName: "アプリ名",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongName: Story = {
  args: {
    appName: "Life Simulator",
  },
};
