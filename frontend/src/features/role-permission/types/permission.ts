import type { UserRole } from "../../../shared/api/authStorage";

export type Permission = {
  id: number;
  code: string;
  description: string;
};

export type RolePermissions = {
  role: UserRole;
  permissions: string[];
};
