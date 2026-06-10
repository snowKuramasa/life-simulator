import { afterEach, describe, expect, it, vi } from "vitest";

import { createCommute, deleteCommute, getCommute, getCommutes, updateCommute } from "@/lib/commutes";

describe("commutes api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("gets commutes list request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            commutes: [
              {
                id: 1,
                workplace_id: 1,
                residence_id: 1,
                commute_minutes: 60,
              },
            ],
          }),
        } as Response),
      ),
    );

    const response = await getCommutes();

    expect(fetch).toHaveBeenCalledWith("/api/v1/commutes", {
      credentials: "include",
    });
    expect(response.commutes).toHaveLength(1);
    expect(response.commutes[0].commute_minutes).toBe(60);
  });

  it("gets commute request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            commute: {
              id: 1,
              workplace_id: 1,
              residence_id: 1,
              commute_minutes: 60,
            },
          }),
        } as Response),
      ),
    );

    const response = await getCommute(1);

    expect(fetch).toHaveBeenCalledWith("/api/v1/commutes/1", {
      credentials: "include",
    });
    expect(response.commute.commute_minutes).toBe(60);
  });

  it("posts commute create request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            commute: {
              id: 1,
              workplace_id: 1,
              residence_id: 1,
              commute_minutes: 60,
            },
          }),
        } as Response),
      ),
    );

    const response = await createCommute({
      workplace_id: 1,
      residence_id: 1,
      commute_minutes: 60,
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/commutes",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          commute: {
            workplace_id: 1,
            residence_id: 1,
            commute_minutes: 60,
          },
        }),
      }),
    );
    expect(response.commute.commute_minutes).toBe(60);
  });

  it("patches commute update request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({
            commute: {
              id: 1,
              workplace_id: 1,
              residence_id: 1,
              commute_minutes: 45,
            },
          }),
        } as Response),
      ),
    );

    const response = await updateCommute({
      id: 1,
      workplace_id: 1,
      residence_id: 1,
      commute_minutes: 45,
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/commutes/1",
      expect.objectContaining({
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          commute: {
            workplace_id: 1,
            residence_id: 1,
            commute_minutes: 45,
          },
        }),
      }),
    );
    expect(response.commute.commute_minutes).toBe(45);
  });

  it("deletes commute request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
        } as Response),
      ),
    );

    await deleteCommute(1);

    expect(fetch).toHaveBeenCalledWith("/api/v1/commutes/1", {
      method: "DELETE",
      credentials: "include",
    });
  });
});
