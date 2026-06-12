// フロントからバックエンド API を呼ぶときの入り口です。
// 本番 / stg では `VITE_API_BASE_URL` を使い、開発中は Vite proxy を使うため
// 相対パスへフォールバックできるようにしています。

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const guestTokenStorageKey = "lifeSimulatorGuestToken";

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return configuredApiBaseUrl ? `${configuredApiBaseUrl}${normalizedPath}` : normalizedPath;
}

export function getGuestToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(guestTokenStorageKey);
}

export function saveGuestToken(guestToken: string | undefined) {
  if (typeof window === "undefined" || !guestToken) {
    return;
  }

  window.localStorage.setItem(guestTokenStorageKey, guestToken);
}

export function clearGuestToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(guestTokenStorageKey);
}

export function buildAuthHeaders(headers: Record<string, string> = {}) {
  const guestToken = getGuestToken();

  return {
    ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
    ...headers,
  };
}
