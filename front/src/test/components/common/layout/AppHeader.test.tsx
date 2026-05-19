import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppHeader } from "@/components/commons/layouts/AppHeader";

describe("AppHeader", () => {
  it("renders the default app name", () => {
    render(<AppHeader />);

    expect(screen.getByText("アプリ名")).toBeInTheDocument();
  });

  it("renders the provided app name", () => {
    render(<AppHeader appName="Life Simulator" />);

    expect(screen.getByText("Life Simulator")).toBeInTheDocument();
  });
});
