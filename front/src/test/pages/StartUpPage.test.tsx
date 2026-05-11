import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StartUpPage } from "@/pages/StartUpPage";

describe("StartUpPage", () => {
  it("renders the start page", () => {
    render(<StartUpPage />);

    expect(screen.getByRole("heading", { name: "利用開始画面" })).toBeInTheDocument();
    expect(screen.getByText(/生活のバランスを簡単に/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "はじめる" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "食卓で過ごす人と犬のイラスト" })).toBeInTheDocument();
  });
});
