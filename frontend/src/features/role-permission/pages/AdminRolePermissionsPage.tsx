import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllPermissions, getRolePermissions, updateRolePermissions } from "../api/rolePermissionApi";
import type { UserRole } from "../../../shared/api/authStorage";
import { ApiError } from "../../../shared/api/apiClient";
import { useAuth } from "../../auth/hooks/useAuth";

export function AdminRolePermissionsPage() {
  const queryClient = useQueryClient();
  const { refreshUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("TEACHER");
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data: allPermissions, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: getAllPermissions,
  });

  const { data: rolePermissionsData, isLoading: isLoadingRole } = useQuery({
    queryKey: ["role-permissions", selectedRole],
    queryFn: () => getRolePermissions(selectedRole),
  });

  useEffect(() => {
    if (rolePermissionsData?.permissions) {
      setCurrentPermissions(rolePermissionsData.permissions);
    }
  }, [rolePermissionsData]);

  const handleTogglePermission = (code: string) => {
    if (selectedRole === "ADMIN") return;
    setFeedback(null);
    setCurrentPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    );
  };

  const handleSave = async () => {
    if (selectedRole === "ADMIN") return;
    setIsSaving(true);
    setFeedback(null);

    try {
      await updateRolePermissions(selectedRole, currentPermissions);
      setFeedback({
        type: "success",
        text: `Đã lưu cấu hình phân quyền cho vai trò ${selectedRole === "TEACHER" ? "Giáo viên" : "Học viên"} thành công!`,
      });
      queryClient.invalidateQueries({ queryKey: ["role-permissions", selectedRole] });
      await refreshUser();
    } catch (err) {
      if (err instanceof ApiError) {
        setFeedback({ type: "error", text: err.message });
      } else {
        setFeedback({ type: "error", text: "Không thể cập nhật phân quyền." });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isLoadingAll || isLoadingRole;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Quản lý Phân quyền (RBAC)</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Cấu hình danh sách quyền chi tiết cho từng vai trò trong hệ thống
        </p>
      </div>

      {feedback && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Role Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {(["TEACHER", "STUDENT", "ADMIN"] as UserRole[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              setSelectedRole(role);
              setFeedback(null);
            }}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              selectedRole === role
                ? "bg-[#003466] text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {role === "ADMIN" ? "Quản trị viên (ADMIN)" : role === "TEACHER" ? "Giáo viên (TEACHER)" : "Học viên (STUDENT)"}
          </button>
        ))}
      </div>

      {selectedRole === "ADMIN" ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 text-xs text-rose-800 font-medium">
          <p className="font-bold text-sm text-rose-900 mb-1">Quyền hạn Quản trị viên (ADMIN):</p>
          Quản trị viên luôn có toàn bộ quyền trong hệ thống và không thể bị chỉnh sửa hoặc giới hạn.
        </div>
      ) : null}

      {/* Permissions Checkbox Grid */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Đang tải danh mục quyền...
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Danh sách quyền cho vai trò {selectedRole}
            </h2>
            {selectedRole !== "ADMIN" && (
              <span className="text-xs text-slate-400">
                Đã chọn: <b>{currentPermissions.length}</b> / {allPermissions?.length || 0} quyền
              </span>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(allPermissions || []).map((perm) => {
              const isChecked = selectedRole === "ADMIN" || currentPermissions.includes(perm.code);
              const isDisabled = selectedRole === "ADMIN";

              return (
                <label
                  key={perm.code}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    isChecked
                      ? "border-[#003466]/40 bg-blue-50/40 text-slate-900"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  } ${isDisabled ? "cursor-not-allowed opacity-80" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleTogglePermission(perm.code)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#003466] focus:ring-[#003466]"
                  />
                  <div>
                    <div className="font-mono text-xs font-bold text-slate-900">{perm.code}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{perm.description}</div>
                  </div>
                </label>
              );
            })}
          </div>

          {selectedRole !== "ADMIN" && (
            <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="rounded-xl bg-[#003466] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#00254a] disabled:opacity-50"
              >
                {isSaving ? "Đang lưu..." : `Lưu phân quyền cho ${selectedRole}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
