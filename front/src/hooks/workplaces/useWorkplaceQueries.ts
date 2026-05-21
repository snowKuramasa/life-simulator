import { useMutation } from "@tanstack/react-query";

import { createWorkplace, updateWorkplace } from "@/lib/workplaces";

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
