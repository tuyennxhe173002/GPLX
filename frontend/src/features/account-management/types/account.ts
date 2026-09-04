import type { UserRole } from "../../../shared/api/authStorage";

export type { UserRole };

export type UserStatus = "ACTIVE" | "DISABLED" | "LOCKED";

export type UserSummary = {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

export type UserDetail = {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  permissions: string[];
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
