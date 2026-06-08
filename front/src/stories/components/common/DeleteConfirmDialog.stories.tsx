import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";

import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { Button } from "@/components/common/baseUi/Button";

const meta = {
  title: "Components/Common/DeleteConfirmDialog",
  component: DeleteConfirmDialog,
  tags: ["autodocs"],
  args: {
    dataName: "A社",
    trigger: <button type="button">削除確認を開く</button>,
    isDeleting: false,
    onConfirm: async () => {},
  },
  render: (args) => (
    <div className="flex min-h-80 items-center justify-center bg-[#f3f8ed] p-6">
      <DeleteConfirmDialog
        {...args}
        trigger={
          <Button type="button" variant="ghost" size="icon" aria-label="A社を削除">
            <Trash2 aria-hidden="true" className="text-[#f97316]" />
          </Button>
        }
      />
    </div>
  ),
} satisfies Meta<typeof DeleteConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Deleting: Story = {
  args: {
    isDeleting: true,
  },
};
