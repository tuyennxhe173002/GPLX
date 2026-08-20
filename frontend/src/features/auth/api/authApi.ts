import { apiPost } from "../../../shared/api/apiClient";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export function login(request: LoginRequest) {
  return apiPost<AuthResponse, LoginRequest>("/api/v1/auth/login", request, {
    auth: false,
    retryOnUnauthorized: false,
  });
}

export function register(request: RegisterRequest) {
  return apiPost<AuthResponse, RegisterRequest>("/api/v1/auth/register", request, {
    auth: false,
    retryOnUnauthorized: false,
  });
}

export function refresh(refreshToken: string) {
  return apiPost<AuthResponse, { refreshToken: string }>("/api/v1/auth/refresh", { refreshToken }, {
    auth: false,
    retryOnUnauthorized: false,
  });
}
