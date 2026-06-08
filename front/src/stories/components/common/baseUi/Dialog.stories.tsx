import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/common/baseUi/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/baseUi/Dialog";

const meta = {
  title: "Components/Common/BaseUi/Dialog",
  component: DialogContent,
  tags: ["autodocs"],
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-[#6f8068] bg-[#fffef8] p-5 text-[#263224]">
        <DialogTitle className="text-base font-bold">ダイアログタイトル</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-[#4f5f4b]">
          baseUi 経由で利用するダイアログです。
        </DialogDescription>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              閉じる
            </Button>
          </DialogClose>
          <Button type="button">実行</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
