import { http, HttpResponse } from "msw";

import type {
  AuthUser,
  Commute,
  CreateCommuteParams,
  CreateResidenceParams,
  CreateWorkplaceParams,
  GuestLoginParams,
  Residence,
  UsageMetric,
  Workplace,
} from "@/types";

let currentUser: AuthUser | null = null;
let usageMetric: UsageMetric = {
  visit_count: 0,
  last_visited_at: null,
  max_combination_count: 0,
  recalculation_count: 0,
};
let workplaceId = 3;
let residenceId = 3;
let commuteId = 2;
const workplaces: Workplace[] = [
  {
    id: 1,
    name: "A社",
    salary: 220000,
    prefecture: "東京都",
    city: "品川区",
  },
  {
    id: 2,
    name: "B社",
    salary: 180000,
    prefecture: "東京都",
    city: "新宿区",
  },
];
const residences: Residence[] = [
  {
    id: 1,
    name: "〇〇",
    rent: 80000,
    prefecture: "東京都",
    city: "杉並区",
  },
  {
    id: 2,
    name: "△△",
    rent: 90000,
    prefecture: "東京都",
    city: "新宿区",
  },
];
const commutes: Commute[] = [
  {
    id: 1,
    workplace_id: 2,
    residence_id: 2,
    commute_minutes: 60,
  },
];

function incrementRecalculationCount() {
  usageMetric = {
    ...usageMetric,
    recalculation_count: usageMetric.recalculation_count + 1,
  };
}

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
    const firstLogin = currentUser === null;

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
      first_login: firstLogin,
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
  http.get("/api/v1/usage_metric", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    return HttpResponse.json({ usage_metric: usageMetric });
  }),
  http.post("/api/v1/usage_metric/result_view", async ({ request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as { combination_count?: number };
    const combinationCount = Math.max(Number(body.combination_count ?? 0), 0);

    usageMetric = {
      ...usageMetric,
      visit_count: usageMetric.last_visited_at ? usageMetric.visit_count : usageMetric.visit_count + 1,
      last_visited_at: new Date().toISOString(),
      max_combination_count: Math.max(usageMetric.max_combination_count, combinationCount),
    };

    return HttpResponse.json({ usage_metric: usageMetric });
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
  http.get("/api/v1/residences", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    return HttpResponse.json({ residences });
  }),
  http.get("/api/v1/residences/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const residence = residences.find((residenceItem) => residenceItem.id === id);

    if (!residence) {
      return HttpResponse.json({ error: "住居が見つかりません" }, { status: 404 });
    }

    return HttpResponse.json({ residence });
  }),
  http.get("/api/v1/commutes", () => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    return HttpResponse.json({ commutes });
  }),
  http.get("/api/v1/commutes/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const commute = commutes.find((commuteItem) => commuteItem.id === id);

    if (!commute) {
      return HttpResponse.json({ error: "通勤時間設定が見つかりません" }, { status: 404 });
    }

    return HttpResponse.json({ commute });
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
    incrementRecalculationCount();

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
    incrementRecalculationCount();

    return HttpResponse.json({ residence }, { status: 201 });
  }),
  http.post("/api/v1/commutes", async ({ request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = (await request.json()) as { commute: CreateCommuteParams };
    const commute = {
      id: commuteId,
      ...body.commute,
    };
    commuteId += 1;
    commutes.push(commute);
    incrementRecalculationCount();

    return HttpResponse.json({ commute }, { status: 201 });
  }),
  http.patch("/api/v1/commutes/:id", async ({ params, request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const commuteIndex = commutes.findIndex((commute) => commute.id === id);

    if (commuteIndex === -1) {
      return HttpResponse.json({ error: "通勤時間設定が見つかりません" }, { status: 404 });
    }

    const body = (await request.json()) as { commute: CreateCommuteParams };
    const commute = {
      ...commutes[commuteIndex],
      ...body.commute,
    };
    commutes[commuteIndex] = commute;
    incrementRecalculationCount();

    return HttpResponse.json({ commute });
  }),
  http.delete("/api/v1/commutes/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const commuteIndex = commutes.findIndex((commute) => commute.id === id);

    if (commuteIndex === -1) {
      return HttpResponse.json({ error: "通勤時間設定が見つかりません" }, { status: 404 });
    }

    commutes.splice(commuteIndex, 1);
    incrementRecalculationCount();

    return new HttpResponse(null, { status: 204 });
  }),
  http.patch("/api/v1/residences/:id", async ({ params, request }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const residenceIndex = residences.findIndex((residence) => residence.id === id);

    if (residenceIndex === -1) {
      return HttpResponse.json({ error: "住居が見つかりません" }, { status: 404 });
    }

    const body = (await request.json()) as { residence: CreateResidenceParams };
    const residence = {
      ...residences[residenceIndex],
      ...body.residence,
    };
    residences[residenceIndex] = residence;
    incrementRecalculationCount();

    return HttpResponse.json({ residence });
  }),
  http.delete("/api/v1/residences/:id", ({ params }) => {
    if (!currentUser) {
      return HttpResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const id = Number(params.id);
    const residenceIndex = residences.findIndex((residence) => residence.id === id);

    if (residenceIndex === -1) {
      return HttpResponse.json({ error: "住居が見つかりません" }, { status: 404 });
    }

    residences.splice(residenceIndex, 1);
    incrementRecalculationCount();

    return new HttpResponse(null, { status: 204 });
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
    incrementRecalculationCount();

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
    incrementRecalculationCount();

    return new HttpResponse(null, { status: 204 });
  }),
];
