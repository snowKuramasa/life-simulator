import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/commons/uis/Button";

describe("Button", () => {
  it("renders as a button with children", () => {
    render(<Button>はじめる</Button>);

    expect(screen.getByRole("button", { name: "はじめる" })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>保存</Button>);
    fireEvent.click(screen.getByRole("button", { name: "保存" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports variant and size props", () => {
    render(
      <Button variant="outline" size="lg">
        戻る
      </Button>,
    );

    const button = screen.getByRole("button", { name: "戻る" });

    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "ghost");
    expect(button).toHaveAttribute("data-size", "default");
  });
});
