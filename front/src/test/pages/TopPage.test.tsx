import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopPage } from "@/pages/TopPage";

describe("TopPage", () => {
  it("renders the page title", () => {
    render(<TopPage />);

    expect(screen.getByRole("heading", { name: "Top Page" })).toBeInTheDocument();
  });
});
