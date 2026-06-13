import { buildApiUrl, buildAuthHeaders, throwApiError } from "@/lib/api";
import type {
  CommuteResponse,
  CommutesResponse,
  CreateCommuteParams,
  UpdateCommuteParams,
} from "@/types";

export async function getCommutes() {
  const response = await fetch(buildApiUrl("/api/v1/commutes"), {
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Commute request failed with ${response.status}`);
  }

  return (await response.json()) as CommutesResponse;
}

export async function getCommute(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/commutes/${id}`), {
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Commute request failed with ${response.status}`);
  }

  return (await response.json()) as CommuteResponse;
}

export async function createCommute(params: CreateCommuteParams) {
  const response = await fetch(buildApiUrl("/api/v1/commutes"), {
    method: "POST",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ commute: params }),
  });

  if (!response.ok) {
    await throwApiError(response, `Commute request failed with ${response.status}`);
  }

  return (await response.json()) as CommuteResponse;
}

export async function updateCommute({ id, ...params }: UpdateCommuteParams) {
  const response = await fetch(buildApiUrl(`/api/v1/commutes/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ commute: params }),
  });

  if (!response.ok) {
    await throwApiError(response, `Commute request failed with ${response.status}`);
  }

  return (await response.json()) as CommuteResponse;
}

export async function deleteCommute(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/commutes/${id}`), {
    method: "DELETE",
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Commute request failed with ${response.status}`);
  }
}
