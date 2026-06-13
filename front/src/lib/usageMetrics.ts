import { buildApiUrl, buildAuthHeaders, throwApiError } from "@/lib/api";
import type { UsageMetricResponse } from "@/types";

type UsageMetricRequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function requestUsageMetric(path: string, init: UsageMetricRequestOptions = {}) {
  const { headers, ...requestInit } = init;

  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...requestInit,
    headers: buildAuthHeaders({
      ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    }),
  });

  if (!response.ok) {
    await throwApiError(response, `Usage metric request failed with ${response.status}`);
  }

  return (await response.json()) as UsageMetricResponse;
}

export async function getUsageMetric() {
  return requestUsageMetric("/api/v1/usage_metric");
}

export async function recordResultView(combinationCount: number) {
  return requestUsageMetric("/api/v1/usage_metric/result_view", {
    method: "POST",
    body: JSON.stringify({ combination_count: combinationCount }),
  });
}
