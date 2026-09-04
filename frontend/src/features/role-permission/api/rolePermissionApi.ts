import { apiGet, apiPut } from "../../../shared/api/apiClient";
import type { Permission, RolePermissions } from "../types/permission";
import type { UserRole } from "../../../shared/api/authStorage";

export function getAllPermissions() {
  return apiGet<Permission[]>("/api/v1/admin/permissions", { auth: true });
}

export function getRolePermissions(role: UserRole) {
  return apiGet<RolePermissions>(`/api/v1/admin/roles/${role}/permissions`, { auth: true });
}

export function updateRolePermissions(role: UserRole, permissions: string[]) {
  return apiPut<RolePermissions, { permissions: string[] }>(
    `/api/v1/admin/roles/${role}/permissions`,
    { permissions },
    { auth: true }
  );
}
