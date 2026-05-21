import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createWorkplace,
  deleteWorkplace,
  getWorkplace,
  getWorkplaces,
  updateWorkplace,
} from "@/lib/workplaces";

export function useWorkplacesQuery() {
  return useQuery({
    queryKey: ["workplaces"],
    queryFn: getWorkplaces,
  });
}

export function useWorkplaceQuery(id: number | null) {
  return useQuery({
    queryKey: ["workplace", id],
    queryFn: () => getWorkplace(id ?? 0),
    enabled: id !== null,
  });
}

export function useCreateWorkplaceMutation() {
  return useMutation({
    mutationFn: createWorkplace,
  });
}

export function useUpdateWorkplaceMutation() {
  return useMutation({
    mutationFn: updateWorkplace,
  });
}

export function useDeleteWorkplaceMutation() {
  return useMutation({
    mutationFn: deleteWorkplace,
  });
}
