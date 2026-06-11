import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createResidence,
  deleteResidence,
  getResidence,
  getResidences,
  updateResidence,
} from "@/lib/residences";
import type { ResidenceResponse, ResidencesResponse } from "@/types";

export function useResidencesQuery(enabled = true) {
  return useQuery({
    queryKey: ["residences"],
    queryFn: getResidences,
    enabled,
  });
}

export function useResidenceQuery(id: number | null) {
  return useQuery({
    queryKey: ["residence", id],
    queryFn: () => getResidence(id ?? 0),
    enabled: id !== null,
  });
}

export function useCreateResidenceMutation() {
  return useMutation({
    mutationFn: createResidence,
  });
}

export function useUpdateResidenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateResidence,
    onSuccess: (data: ResidenceResponse) => {
      queryClient.setQueryData(["residence", data.residence.id], data);
      queryClient.setQueryData<ResidencesResponse>(["residences"], (currentData) => {
        if (!currentData) {
          return currentData;
        }

        return {
          residences: currentData.residences.map((residence) =>
            residence.id === data.residence.id ? data.residence : residence,
          ),
        };
      });
    },
  });
}

export function useDeleteResidenceMutation() {
  return useMutation({
    mutationFn: deleteResidence,
  });
}
