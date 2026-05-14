import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchCurrentUser, guestLogin, logout } from "@/lib/auth";

describe("auth api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts guest login request with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          authenticated: true,
          user: {
            id: 1,
            name: "ゲスト",
            provider: "guest",
            guest: true,
          },
        }),
      }),
    );

    const response = await guestLogin({ name: "ゲスト" });

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/guest",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: "ゲスト" }),
      }),
    );
    expect(response.user?.name).toBe("ゲスト");
  });

  it("fetches current user with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          authenticated: true,
          user: {
            id: 1,
            name: "ゲスト",
            provider: "guest",
            guest: true,
          },
        }),
      }),
    );

    await fetchCurrentUser();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/me",
      expect.objectContaining({
        credentials: "include",
      }),
    );
  });

  it("logs out with credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    );

    await logout();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/logout",
      expect.objectContaining({
        method: "DELETE",
        credentials: "include",
      }),
    );
  });

  it("returns unauthenticated response when current user request returns 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    await expect(fetchCurrentUser()).resolves.toEqual({
      authenticated: false,
      user: null,
    });
  });

  it("throws when current user request fails with an unexpected status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchCurrentUser()).rejects.toThrow("Auth request failed with 500");
  });
});
