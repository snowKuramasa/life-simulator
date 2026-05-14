import { buildApiUrl } from "@/lib/api";
import type { AuthResponse, GuestLoginParams } from "@/types";

async function requestAuth(path: string, init: RequestInit = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Auth request failed with ${response.status}`);
  }

  return response;
}

export async function guestLogin({ name }: GuestLoginParams = {}) {
  const response = await requestAuth("/api/v1/auth/guest", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

  return (await response.json()) as AuthResponse;
}

export async function fetchCurrentUser() {
  const response = await fetch(buildApiUrl("/api/v1/auth/me"), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    return {
      authenticated: false,
      user: null,
    } satisfies AuthResponse;
  }

  if (!response.ok) {
    throw new Error(`Auth request failed with ${response.status}`);
  }

  return (await response.json()) as AuthResponse;
}

export async function logout() {
  await requestAuth("/api/v1/auth/logout", {
    method: "DELETE",
  });
}
