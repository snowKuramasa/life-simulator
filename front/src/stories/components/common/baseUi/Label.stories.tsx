import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "@/components/common/baseUi/Label";

const meta = {
  title: "Components/Common/BaseUi/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "ラベル",
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
