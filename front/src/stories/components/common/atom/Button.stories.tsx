import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/common/atom/Button";

const meta = {
  title: "Components/Common/Atom/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "はじめる",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "戻る",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "スキップ",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Button size="sm">Small</Button>
      <Button>Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
