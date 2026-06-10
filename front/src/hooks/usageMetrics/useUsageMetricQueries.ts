import { useMutation, useQuery } from "@tanstack/react-query";

import { getUsageMetric, recordResultView } from "@/lib/usageMetrics";

export const usageMetricQueryKey = ["usageMetric"] as const;

export function useUsageMetricQuery() {
  return useQuery({
    queryKey: usageMetricQueryKey,
    queryFn: getUsageMetric,
  });
}

export function useRecordResultViewMutation() {
  return useMutation({
    mutationFn: recordResultView,
  });
}
