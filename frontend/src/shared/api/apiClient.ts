import { clearAuthSession, getAuthSession, setAuthSession } from "../auth/authSession";
import { getAccessToken, getRefreshToken } from "./authStorage";
import { ApiError, toApiError } from "./apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type QueryValue = string | number | boolean | undefined | null;
type RequestOptions = {
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
};

let refreshPromise: Promise<string | null> | null = null;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const base = API_BASE_URL ? `${API_BASE_URL.replace(/\/$/, "")}/` : window.location.origin;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, base);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") {
        continue;
      }
      url.searchParams.set(key, String(value));
    }
  }

  return API_BASE_URL ? url.toString() : `${url.pathname}${url.search}`;
}

async function refreshAccessToken() {
  const currentSession = getAuthSession();
  const refreshToken = currentSession?.refreshToken ?? getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(buildUrl("/api/v1/auth/refresh"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await toApiError(response);
        }

        return (await response.json()) as RefreshResponse;
      })
      .then((response) => {
        setAuthSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        });

        return response.accessToken;
      })
      .catch(() => {
        clearAuthSession();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, QueryValue>,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, retryOnUnauthorized = true } = options;
  const token = auth ? getAccessToken() : null;
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers,
  });

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const nextToken = await refreshAccessToken();

    if (nextToken) {
      return request<T>(path, init, query, { auth, retryOnUnauthorized: false });
    }
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string, query?: Record<string, QueryValue>, options?: RequestOptions) {
  return request<T>(path, { method: "GET" }, query, options);
}

export function apiPost<TResponse, TBody>(path: string, body: TBody, options?: RequestOptions) {
  return request<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  }, undefined, options);
}

export function apiPut<TResponse, TBody>(path: string, body: TBody, options?: RequestOptions) {
  return request<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  }, undefined, options);
}

export function apiDelete(path: string, options?: RequestOptions) {
  return request<void>(path, { method: "DELETE" }, undefined, options);
}

export { ApiError };
