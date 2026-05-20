import { useMutation } from "@tanstack/react-query";

import { createWorkplace } from "@/lib/workplaces";

export function useCreateWorkplaceMutation() {
  return useMutation({
    mutationFn: createWorkplace,
  });
}
