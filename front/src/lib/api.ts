// フロントからバックエンド API を呼ぶときの入り口です。
// 本番 / stg では `VITE_API_BASE_URL` を使い、開発中は Vite proxy を使うため
// 相対パスへフォールバックできるようにしています。

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

type ApiErrorBody = {
  error?: string;
  errors?: Record<string, string[] | string>;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

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

async function parseErrorBody(response: Response) {
  const contentType = response.headers?.get?.("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return (await response.json()) as ApiErrorBody;
  } catch {
    return null;
  }
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  const body = await parseErrorBody(response);
  const message = body?.error ?? flattenValidationErrors(body?.errors) ?? fallbackMessage;

  throw new ApiError(message, response.status, body);
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError && (error.body?.error || error.body?.errors)) {
    return error.message;
  }

  return fallbackMessage;
}

function flattenValidationErrors(errors: ApiErrorBody["errors"]) {
  if (!errors) {
    return null;
  }

  return Object.values(errors)
    .flatMap((messages) => (Array.isArray(messages) ? messages : [messages]))
    .filter(Boolean)
    .join("、");
}
