import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/common/baseUi/Button";
import { GuestLogoutConfirmDialog } from "@/components/common/GuestLogoutConfirmDialog";

describe("GuestLogoutConfirmDialog", () => {
  it("shows guest logout warning and confirms logout", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <GuestLogoutConfirmDialog
        userName="ゲスト"
        trigger={<Button type="button">ログアウト</Button>}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "ログアウト" }));

    expect(screen.getByRole("heading", { name: "ゲストログアウト確認" })).toBeInTheDocument();
    expect(screen.getByText(/ゲストのためログアウトすると/)).toHaveTextContent(
      "ゲストのためログアウトすると、 保存している情報はすべて削除されます。 よろしいですか？",
    );
    expect(screen.getByText("ゲスト")).toBeInTheDocument();

    const logoutButtons = screen.getAllByRole("button", { name: "ログアウト" });
    const confirmButton = logoutButtons[logoutButtons.length - 1];

    if (!confirmButton) {
      throw new Error("Confirm button was not found");
    }

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });
});
