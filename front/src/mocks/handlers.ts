import { http, HttpResponse } from "msw";

import type {
  AuthUser,
  CreateResidenceParams,
  CreateWorkplaceParams,
  GuestLoginParams,
  Residence,
  Workplace,
} from "@/types";

let currentUser: AuthUser | null = null;
let workplaceId = 1;
let residenceId = 1;
const workplaces: Workplace[] = [];
const residences: Residence[] = [];

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
  http.get("/api/v1/workplaces", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    return HttpResponse.json({ workplaces });
  }),
  http.get("/api/v1/workplaces/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const workplace = workplaces.find((workplaceItem) => workplaceItem.id === id);

    if (!workplace) {
      return HttpResponse.json({ error: "勤務先が見つかりません" }, { status: 404 });
    }

    return HttpResponse.json({ workplace });
  }),
  http.post("/api/v1/workplaces", async ({ request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = (await request.json()) as { workplace: CreateWorkplaceParams };
    const workplace = {
      id: workplaceId,
      ...body.workplace,
    };
    workplaceId += 1;
    workplaces.push(workplace);

    return HttpResponse.json({ workplace }, { status: 201 });
  }),
  http.post("/api/v1/residences", async ({ request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = (await request.json()) as { residence: CreateResidenceParams };
    const residence = {
      id: residenceId,
      ...body.residence,
    };
    residenceId += 1;
    residences.push(residence);

    return HttpResponse.json({ residence }, { status: 201 });
  }),
  http.patch("/api/v1/workplaces/:id", async ({ params, request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const workplaceIndex = workplaces.findIndex((workplace) => workplace.id === id);

    if (workplaceIndex === -1) {
      return HttpResponse.json({ error: "勤務先が見つかりません" }, { status: 404 });
    }

    const body = (await request.json()) as { workplace: CreateWorkplaceParams };
    const workplace = {
      ...workplaces[workplaceIndex],
      ...body.workplace,
    };
    workplaces[workplaceIndex] = workplace;

    return HttpResponse.json({ workplace });
  }),
  http.delete("/api/v1/workplaces/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const workplaceIndex = workplaces.findIndex((workplace) => workplace.id === id);

    if (workplaceIndex === -1) {
      return HttpResponse.json({ error: "勤務先が見つかりません" }, { status: 404 });
    }

    workplaces.splice(workplaceIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
