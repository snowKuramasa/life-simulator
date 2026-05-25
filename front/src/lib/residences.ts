import { buildApiUrl } from "@/lib/api";
import type { CreateResidenceParams, ResidenceResponse } from "@/types";

export async function createResidence(params: CreateResidenceParams) {
  const response = await fetch(buildApiUrl("/api/v1/residences"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ residence: params }),
  });

  if (!response.ok) {
    throw new Error(`Residence request failed with ${response.status}`);
  }

  return (await response.json()) as ResidenceResponse;
}
