// フロントからバックエンド API を呼ぶときの入り口です。
// 本番 / stg では `VITE_API_BASE_URL` を使い、開発中は Vite proxy を使うため
// 相対パスへフォールバックできるようにしています。

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return configuredApiBaseUrl ? `${configuredApiBaseUrl}${normalizedPath}` : normalizedPath;
}

function normalizeHeaders(headers: HeadersInit) {
  const normalizedHeaders: Record<string, string> = {};

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalizedHeaders[key] = value;
    });

    return normalizedHeaders;
  }

  if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      normalizedHeaders[key] = value;
    });

    return normalizedHeaders;
  }

  return {
    ...headers,
  };
}

export function buildAuthHeaders(headers: HeadersInit = {}, defaultHeaders: Record<string, string> = {}) {
  return {
    ...defaultHeaders,
    ...normalizeHeaders(headers),
  };
}
