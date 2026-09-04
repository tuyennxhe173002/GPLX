import { apiGet, apiPut } from "../../../shared/api/apiClient";
import type { PageResponse, UserDetail, UserRole, UserStatus, UserSummary } from "../types/account";

export interface GetUsersParams {
  search?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
  page?: number;
  size?: number;
}

export function getAdminUsers(params: GetUsersParams = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search.trim());
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.page !== undefined) query.set("page", params.page.toString());
  if (params.size !== undefined) query.set("size", params.size.toString());

  const queryString = query.toString();
  const url = queryString ? `/api/v1/admin/users?${queryString}` : "/api/v1/admin/users";

  return apiGet<PageResponse<UserSummary>>(url, { auth: true });
}

export function getAdminUserById(id: number) {
  return apiGet<UserDetail>(`/api/v1/admin/users/${id}`, { auth: true });
}

export function updateUserRole(id: number, role: UserRole) {
  return apiPut<UserDetail, { role: UserRole }>(
    `/api/v1/admin/users/${id}/role`,
    { role },
    { auth: true }
  );
}

export function updateUserStatus(id: number, status: UserStatus) {
  return apiPut<UserDetail, { status: UserStatus }>(
    `/api/v1/admin/users/${id}/status`,
    { status },
    { auth: true }
  );
}
