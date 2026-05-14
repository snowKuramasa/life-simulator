import { http, HttpResponse } from "msw";

import type { AuthUser, GuestLoginParams } from "@/types";

let currentUser: AuthUser | null = null;

export const handlers = [
  http.get("/api/v1/health", () => {
    return HttpResponse.json({
      status: "ok",
      message: "Mock API is ready",
      sample_calculation: {
        monthly_income: 280000,
        fixed_costs: 120000,
        disposable_income: 160000,
      },
      timestamp: new Date("2026-05-11T00:00:00.000Z").toISOString(),
    });
  }),
  http.post("/api/v1/auth/guest", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as GuestLoginParams;
    const name = body.name?.trim() || "ゲスト";

    currentUser ||= {
      id: 1,
      name,
      provider: "guest",
      guest: true,
    };

    currentUser = {
      ...currentUser,
      name,
    };

    return HttpResponse.json({
      authenticated: true,
      user: currentUser,
    });
  }),
  http.get("/api/v1/auth/me", () => {
    if (!currentUser) {
      return HttpResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      authenticated: true,
      user: currentUser,
    });
  }),
  http.delete("/api/v1/auth/logout", () => {
    currentUser = null;

    return new HttpResponse(null, { status: 204 });
  }),
];
