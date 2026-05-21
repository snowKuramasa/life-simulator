import { useMutation } from "@tanstack/react-query";

import { createWorkplace, deleteWorkplace, updateWorkplace } from "@/lib/workplaces";

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
