import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppHeader } from "@/components/common/layouts/AppHeader";

const meta = {
  title: "Components/Common/Layout/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    appName: "住みかとしごと",
    subtitle: "これからの暮らしを、少し具体的に。",
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
    appName: "住みかとしごと",
    subtitle: "住む場所と働く場所から、これからの暮らしを少し具体的に描きます。",
  },
};
