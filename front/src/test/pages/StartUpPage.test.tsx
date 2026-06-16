import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { StartUpPage } from "@/pages/StartUpPage";

describe("StartUpPage", () => {
  it("renders the start page", () => {
    render(
      <MemoryRouter>
        <StartUpPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "利用開始画面" })).toBeInTheDocument();
    expect(screen.getByText("mitooshi")).toBeInTheDocument();
    expect(screen.getByText("住まいとお金から、暮らしを考える")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "はじめる" })).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("img", { name: "飲み物を持って窓辺で過ごす人のイラスト" }),
    ).toBeInTheDocument();
  });
});
