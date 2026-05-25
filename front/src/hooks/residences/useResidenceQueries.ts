import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createResidence,
  deleteResidence,
  getResidence,
  getResidences,
  updateResidence,
} from "@/lib/residences";

export function useResidencesQuery() {
  return useQuery({
    queryKey: ["residences"],
    queryFn: getResidences,
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
  return useMutation({
    mutationFn: updateResidence,
  });
}

export function useDeleteResidenceMutation() {
  return useMutation({
    mutationFn: deleteResidence,
  });
}
