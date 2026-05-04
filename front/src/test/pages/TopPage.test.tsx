import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TopPage } from "@/pages/TopPage";

describe("TopPage", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          message: "Backend API is ready",
          sample_calculation: {
            monthly_income: 280000,
            fixed_costs: 120000,
            disposable_income: 160000,
          },
          timestamp: "2026-05-04T00:00:00Z",
        }),
      }),
    );
  });

  it("renders the page title", async () => {
    render(<TopPage />);

    expect(screen.getByRole("heading", { name: "Top Page" })).toBeInTheDocument();
    expect(await screen.findByText("Backend API is ready")).toBeInTheDocument();
  });
});
