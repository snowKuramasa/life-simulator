import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthSession, guestLogin, logout } from "@/lib/auth";

describe("auth api", () => {
  afterEach(() => {
    window.localStorage.clear();
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
          first_login: true,
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
    expect(response.first_login).toBe(true);
  });

  it("fetches auth session with credentials", async () => {
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

    await fetchAuthSession();

    expect(fetch).toHaveBeenCalledWith(
      "/api/v1/auth/session",
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

  it("returns unauthenticated response when auth session request returns 401", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }),
    );

    await expect(fetchAuthSession()).resolves.toEqual({
      authenticated: false,
      user: null,
    });
  });

  it("throws when auth session request fails with an unexpected status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchAuthSession()).rejects.toThrow("Auth session request failed with 500");
  });
});
