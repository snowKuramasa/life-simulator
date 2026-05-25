import { buildApiUrl } from "@/lib/api";
import type {
  CreateResidenceParams,
  ResidenceResponse,
  ResidencesResponse,
  UpdateResidenceParams,
} from "@/types";

export async function getResidences() {
  const response = await fetch(buildApiUrl("/api/v1/residences"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Residence request failed with ${response.status}`);
  }

  return (await response.json()) as ResidencesResponse;
}

export async function getResidence(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/residences/${id}`), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Residence request failed with ${response.status}`);
  }

  return (await response.json()) as ResidenceResponse;
}

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

export async function updateResidence({ id, ...params }: UpdateResidenceParams) {
  const response = await fetch(buildApiUrl(`/api/v1/residences/${id}`), {
    method: "PATCH",
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

export async function deleteResidence(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/residences/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Residence request failed with ${response.status}`);
  }
}
