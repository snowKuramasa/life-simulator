import { http, HttpResponse } from "msw";

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
];
