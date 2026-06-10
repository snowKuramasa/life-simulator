import { afterEach, describe, expect, it, vi } from "vitest";

import { getUsageMetric, recordResultView } from "@/lib/usageMetrics";

describe("usage metrics api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts result view metric with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          usage_metric: {
            visit_count: 1,
            last_visited_at: "2026-06-10T00:00:00Z",
            max_combination_count: 4,
            recalculation_count: 0,
          },
        }),
      }),
    );

    const response = await recordResultView(4);

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/usage_metric/result_view",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ combination_count: 4 }),
      }),
    );
    expect(response.usage_metric.max_combination_count).toBe(4);
  });

  it("fetches usage metric with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          usage_metric: {
            visit_count: 1,
            last_visited_at: "2026-06-10T00:00:00Z",
            max_combination_count: 4,
            recalculation_count: 0,
          },
        }),
      }),
    );

    await getUsageMetric();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/usage_metric",
      expect.objectContaining({
        credentials: "include",
      }),
    );
  });
});
