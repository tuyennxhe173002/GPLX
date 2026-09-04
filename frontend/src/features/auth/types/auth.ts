import type { AuthUser } from "../../../shared/api/authStorage";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

export type CurrentUserResponse = {
  id: number;
  email: string;
  fullName: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  status: "ACTIVE" | "DISABLED" | "LOCKED";
  mustChangePassword: boolean;
  permissions: string[];
  createdAt: string;
  lastLoginAt: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type GenericMessageResponse = {
  message: string;
};
