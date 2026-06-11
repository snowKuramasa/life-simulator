import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader } from "@/components/common/layouts/AppHeader";

const meta = {
  title: "Components/Common/Layout/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    subtitle: "住まいとお金から、暮らしを考える",
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
    appName: "mitooshi",
    subtitle: "勤務先と住まいの組み合わせから、暮らしの見通しを立てます。",
  },
};
