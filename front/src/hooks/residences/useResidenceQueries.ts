import { useMutation } from "@tanstack/react-query";

import { createResidence } from "@/lib/residences";

export function useCreateResidenceMutation() {
  return useMutation({
    mutationFn: createResidence,
  });
}
