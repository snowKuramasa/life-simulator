import { afterEach, describe, expect, it, vi } from "vitest";

import { createWorkplace, deleteWorkplace, getWorkplace, getWorkplaces, updateWorkplace } from "@/lib/workplaces";

describe("workplaces api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts workplace create request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          workplace: {
            id: 1,
            name: "候補A",
            salary: 220_000,
            prefecture: "東京都",
            city: "品川区",
          },
        }),
      }),
    );

    await createWorkplace({
      name: "候補A",
      salary: 220_000,
      prefecture: "東京都",
      city: "品川区",
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/workplaces",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          workplace: {
            name: "候補A",
            salary: 220_000,
            prefecture: "東京都",
            city: "品川区",
          },
        }),
      }),
    );
  });

  it("gets workplaces list request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          workplaces: [
            {
              id: 1,
              name: "候補A",
              salary: 220_000,
              prefecture: "東京都",
              city: "品川区",
            },
          ],
        }),
      }),
    );

    const response = await getWorkplaces();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/workplaces",
      expect.objectContaining({
        credentials: "include",
      }),
    );
    expect(response.workplaces).toHaveLength(1);
    expect(response.workplaces[0].name).toBe("候補A");
  });

  it("gets workplace request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          workplace: {
            id: 1,
            name: "候補A",
            salary: 220_000,
            prefecture: "東京都",
            city: "品川区",
          },
        }),
      }),
    );

    const response = await getWorkplace(1);

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/workplaces/1",
      expect.objectContaining({
        credentials: "include",
      }),
    );
    expect(response.workplace.name).toBe("候補A");
  });

  it("patches workplace update request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          workplace: {
            id: 1,
            name: "候補B",
            salary: 250_000,
            prefecture: "神奈川県",
            city: "横浜市",
          },
        }),
      }),
    );

    const response = await updateWorkplace({
      id: 1,
      name: "候補B",
      salary: 250_000,
      prefecture: "神奈川県",
      city: "横浜市",
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/workplaces/1",
      expect.objectContaining({
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          workplace: {
            name: "候補B",
            salary: 250_000,
            prefecture: "神奈川県",
            city: "横浜市",
          },
        }),
      }),
    );
    expect(response.workplace.name).toBe("候補B");
  });

  it("throws when workplace request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(
      updateWorkplace({
        id: 999,
        name: "候補B",
        salary: 250_000,
        prefecture: "神奈川県",
        city: "横浜市",
      }),
    ).rejects.toThrow("Workplace request failed with 404");
  });

  it("deletes workplace request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    );

    await deleteWorkplace(1);

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/workplaces/1",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
      }),
    );
  });
});
