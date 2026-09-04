import { apiGet, apiPost, apiPut } from "../../../shared/api/apiClient";
import type {
  AuthResponse,
  ChangePasswordRequest,
  CurrentUserResponse,
  ForgotPasswordRequest,
  GenericMessageResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "../types/auth";

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

export function getCurrentUser() {
  return apiGet<CurrentUserResponse>("/api/v1/auth/me", {
    auth: true,
  });
}

export function forgotPassword(request: ForgotPasswordRequest) {
  return apiPost<GenericMessageResponse, ForgotPasswordRequest>("/api/v1/auth/forgot-password", request, {
    auth: false,
    retryOnUnauthorized: false,
  });
}

export function resetPassword(request: ResetPasswordRequest) {
  return apiPost<GenericMessageResponse, ResetPasswordRequest>("/api/v1/auth/reset-password", request, {
    auth: false,
    retryOnUnauthorized: false,
  });
}

export function changePassword(request: ChangePasswordRequest) {
  return apiPut<GenericMessageResponse, ChangePasswordRequest>("/api/v1/auth/password", request, {
    auth: true,
  });
}
