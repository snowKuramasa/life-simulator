import { type ReactNode, useState } from "react";

import { Button } from "@/components/common/baseUi/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/baseUi/Dialog";

import styles from "./GuestLogoutConfirmDialog.module.css";

type GuestLogoutConfirmDialogProps = {
  userName: string;
  trigger: ReactNode;
  isLoggingOut?: boolean;
  onConfirm: () => Promise<void>;
};

export function GuestLogoutConfirmDialog({
  userName,
  trigger,
  isLoggingOut = false,
  onConfirm,
}: GuestLogoutConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleConfirm() {
    await onConfirm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogTitle className={styles.title}>ゲストログアウト確認</DialogTitle>
        <DialogDescription className={styles.description}>
          {"ゲストのためログアウトすると、\n保存している情報はすべて削除されます。\nよろしいですか？"}
        </DialogDescription>
        <p className={styles.userName}>{userName}</p>

        <div className={styles.actions}>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoggingOut}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            className={styles.logoutButton}
            disabled={isLoggingOut}
            onClick={() => void handleConfirm()}
          >
            {isLoggingOut ? "ログアウト中..." : "ログアウト"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
