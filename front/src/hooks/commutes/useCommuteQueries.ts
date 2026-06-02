import { useMutation, useQuery } from "@tanstack/react-query";

import { createCommute, deleteCommute, getCommute, getCommutes, updateCommute } from "@/lib/commutes";

export function useCommutesQuery() {
  return useQuery({
    queryKey: ["commutes"],
    queryFn: getCommutes,
  });
}

export function useCommuteQuery(id: number | null) {
  return useQuery({
    queryKey: ["commute", id],
    queryFn: () => getCommute(id ?? 0),
    enabled: id !== null,
  });
}

export function useCreateCommuteMutation() {
  return useMutation({
    mutationFn: createCommute,
  });
}

export function useUpdateCommuteMutation() {
  return useMutation({
    mutationFn: updateCommute,
  });
}

export function useDeleteCommuteMutation() {
  return useMutation({
    mutationFn: deleteCommute,
  });
}
