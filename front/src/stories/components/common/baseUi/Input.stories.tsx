import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "@/components/common/baseUi/Input";

const meta = {
  title: "Components/Common/BaseUi/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "入力してください",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "編集できません",
  },
};
