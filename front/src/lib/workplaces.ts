import { buildApiUrl, buildAuthHeaders, throwApiError } from "@/lib/api";
import type {
  CreateWorkplaceParams,
  UpdateWorkplaceParams,
  WorkplaceResponse,
  WorkplacesResponse,
} from "@/types";

export async function getWorkplaces() {
  const response = await fetch(buildApiUrl("/api/v1/workplaces"), {
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Workplace request failed with ${response.status}`);
  }

  return (await response.json()) as WorkplacesResponse;
}

export async function getWorkplace(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/workplaces/${id}`), {
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Workplace request failed with ${response.status}`);
  }

  return (await response.json()) as WorkplaceResponse;
}

export async function createWorkplace(params: CreateWorkplaceParams) {
  const response = await fetch(buildApiUrl("/api/v1/workplaces"), {
    method: "POST",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ workplace: params }),
  });

  if (!response.ok) {
    await throwApiError(response, `Workplace request failed with ${response.status}`);
  }

  return (await response.json()) as WorkplaceResponse;
}

export async function updateWorkplace({ id, ...params }: UpdateWorkplaceParams) {
  const response = await fetch(buildApiUrl(`/api/v1/workplaces/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: buildAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ workplace: params }),
  });

  if (!response.ok) {
    await throwApiError(response, `Workplace request failed with ${response.status}`);
  }

  return (await response.json()) as WorkplaceResponse;
}

export async function deleteWorkplace(id: number) {
  const response = await fetch(buildApiUrl(`/api/v1/workplaces/${id}`), {
    method: "DELETE",
    credentials: "include",
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, `Workplace request failed with ${response.status}`);
  }
}
