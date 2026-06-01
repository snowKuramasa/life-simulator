import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "@/components/common/layouts/AppHeader";

describe("AppHeader", () => {
  it("renders the default brand", () => {
    render(<AppHeader />);

    expect(screen.getByText("住みかとしごと")).toBeInTheDocument();
    expect(screen.getByText("これからの暮らしを、少し具体的に。")).toBeInTheDocument();
  });

  it("renders the provided brand", () => {
    render(<AppHeader appName="Life Simulator" subtitle="暮らしを描く。" />);

    expect(screen.getByText("Life Simulator")).toBeInTheDocument();
    expect(screen.getByText("暮らしを描く。")).toBeInTheDocument();
  });
});
