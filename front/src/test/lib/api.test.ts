import { describe, expect, it, vi } from "vitest";

describe("buildApiUrl", () => {
  it("returns a relative path when VITE_API_BASE_URL is not set", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.resetModules();

    const { buildApiUrl } = await import("@/lib/api");

    expect(buildApiUrl("/api/v1/health")).toBe("/api/v1/health");
  });

  it("joins VITE_API_BASE_URL and the given path", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://life-simulator-back-prod.onrender.com/");
    vi.resetModules();

    const { buildApiUrl } = await import("@/lib/api");

    expect(buildApiUrl("/api/v1/health")).toBe(
      "https://life-simulator-back-prod.onrender.com/api/v1/health",
    );
  });
});
