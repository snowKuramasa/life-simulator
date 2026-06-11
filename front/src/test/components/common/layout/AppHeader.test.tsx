import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "@/components/common/layouts/AppHeader";

describe("AppHeader", () => {
  it("renders the default brand", () => {
    render(<AppHeader />);

    expect(screen.getByRole("img", { name: "mitooshi" })).toBeInTheDocument();
    expect(screen.getByText("住まいとお金から、暮らしを考える")).toBeInTheDocument();
  });

  it("renders the provided brand", () => {
    render(<AppHeader appName="Life Simulator" subtitle="暮らしを描く。" />);

    expect(screen.getByText("Life Simulator")).toBeInTheDocument();
    expect(screen.getByText("暮らしを描く。")).toBeInTheDocument();
  });
});
