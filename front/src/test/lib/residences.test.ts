import { afterEach, describe, expect, it, vi } from "vitest";

import { createResidence } from "@/lib/residences";

describe("residences api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts residence create request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          residence: {
            id: 1,
            name: "候補A",
            rent: 80_000,
            prefecture: "東京都",
            city: "品川区",
          },
        }),
      }),
    );

    const response = await createResidence({
      name: "候補A",
      rent: 80_000,
      prefecture: "東京都",
      city: "品川区",
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/residences",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          residence: {
            name: "候補A",
            rent: 80_000,
            prefecture: "東京都",
            city: "品川区",
          },
        }),
      }),
    );
    expect(response.residence.name).toBe("候補A");
  });

  it("throws when residence request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
      }),
    );

    await expect(
      createResidence({
        name: "",
        rent: -1,
        prefecture: "",
        city: "",
      }),
    ).rejects.toThrow("Residence request failed with 422");
  });
});
