import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWorkplace,
  deleteWorkplace,
  getWorkplace,
  getWorkplaces,
  updateWorkplace,
} from "@/lib/workplaces";
import type { WorkplaceResponse, WorkplacesResponse } from "@/types";

export function useWorkplacesQuery(enabled = true) {
  return useQuery({
    queryKey: ["workplaces"],
    queryFn: getWorkplaces,
    enabled,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkplace,
    onSuccess: (data: WorkplaceResponse) => {
      queryClient.setQueryData(["workplace", data.workplace.id], data);
      queryClient.setQueryData<WorkplacesResponse>(["workplaces"], (currentData) => {
        if (!currentData) {
          return currentData;
        }

        return {
          workplaces: currentData.workplaces.map((workplace) =>
            workplace.id === data.workplace.id ? data.workplace : workplace,
          ),
        };
      });
    },
  });
}

export function useDeleteWorkplaceMutation() {
  return useMutation({
    mutationFn: deleteWorkplace,
  });
}
