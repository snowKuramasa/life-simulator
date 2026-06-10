import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/common/baseUi/Button";
import { GuestLogoutConfirmDialog } from "@/components/common/GuestLogoutConfirmDialog";

const meta = {
  title: "Components/Common/GuestLogoutConfirmDialog",
  component: GuestLogoutConfirmDialog,
  args: {
    userName: "ゲスト",
    trigger: <Button type="button">ログアウト</Button>,
    isLoggingOut: false,
    onConfirm: async () => undefined,
  },
} satisfies Meta<typeof GuestLogoutConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoggingOut: Story = {
  args: {
    isLoggingOut: true,
  },
};
