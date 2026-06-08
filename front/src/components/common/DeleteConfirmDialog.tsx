import { Button } from "@/components/common/baseUi/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ReactNode, useState } from "react";

import styles from "./DeleteConfirmDialog.module.css";

type DeleteConfirmDialogProps = {
  dataName: string;
  trigger: ReactNode;
  isDeleting?: boolean;
  onConfirm: () => Promise<void>;
};

export function DeleteConfirmDialog({
  dataName,
  trigger,
  isDeleting = false,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleConfirm() {
    await onConfirm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={styles.content}>
        <DialogTitle className={styles.title}>削除確認</DialogTitle>
        <DialogDescription className={styles.description}>
          以下のデータを削除します。よろしいですか？
        </DialogDescription>
        <p className={styles.dataName}>{dataName}</p>

        <div className={styles.actions}>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isDeleting}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            className={styles.deleteButton}
            disabled={isDeleting}
            onClick={() => void handleConfirm()}
          >
            {isDeleting ? "削除中..." : "削除"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
