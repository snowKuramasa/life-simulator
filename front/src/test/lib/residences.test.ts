import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createResidence,
  deleteResidence,
  getResidence,
  getResidences,
  updateResidence,
} from "@/lib/residences";

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

  it("gets residences list request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          residences: [
            {
              id: 1,
              name: "候補A",
              rent: 80_000,
              prefecture: "東京都",
              city: "品川区",
            },
          ],
        }),
      }),
    );

    const response = await getResidences();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/residences",
      expect.objectContaining({
        credentials: "include",
      }),
    );
    expect(response.residences).toHaveLength(1);
    expect(response.residences[0].name).toBe("候補A");
  });

  it("gets residence request with credentials", async () => {
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

    const response = await getResidence(1);

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/residences/1",
      expect.objectContaining({
        credentials: "include",
      }),
    );
    expect(response.residence.name).toBe("候補A");
  });

  it("patches residence update request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          residence: {
            id: 1,
            name: "候補B",
            rent: 95_000,
            prefecture: "神奈川県",
            city: "横浜市",
          },
        }),
      }),
    );

    const response = await updateResidence({
      id: 1,
      name: "候補B",
      rent: 95_000,
      prefecture: "神奈川県",
      city: "横浜市",
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/residences/1",
      expect.objectContaining({
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          residence: {
            name: "候補B",
            rent: 95_000,
            prefecture: "神奈川県",
            city: "横浜市",
          },
        }),
      }),
    );
    expect(response.residence.name).toBe("候補B");
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

  it("deletes residence request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    );

    await deleteResidence(1);

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/residences/1",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
      }),
    );
  });
});
