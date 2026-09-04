import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers, updateUserRole, updateUserStatus } from "../api/accountApi";
import type { UserRole, UserStatus, UserSummary } from "../types/account";
import { ApiError } from "../../../shared/api/apiClient";

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
  const [page, setPage] = useState(0);

  const [targetUser, setTargetUser] = useState<UserSummary | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("STUDENT");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", searchTerm, selectedRole, selectedStatus, page],
    queryFn: () =>
      getAdminUsers({
        search: searchTerm,
        role: selectedRole,
        status: selectedStatus,
        page,
        size: 20,
      }),
  });

  const handleOpenRoleModal = (user: UserSummary) => {
    setTargetUser(user);
    setNewRole(user.role === "TEACHER" ? "STUDENT" : "TEACHER");
    setIsRoleModalOpen(true);
    setFeedbackMessage(null);
  };

  const handleSaveRole = async () => {
    if (!targetUser) return;
    setIsUpdating(true);
    setFeedbackMessage(null);

    try {
      await updateUserRole(targetUser.id, newRole);
      setFeedbackMessage({
        type: "success",
        text: `Đã cập nhật vai trò của ${targetUser.fullName} thành ${newRole === "TEACHER" ? "Giáo viên" : "Học viên"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setIsRoleModalOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setFeedbackMessage({ type: "error", text: err.message });
      } else {
        setFeedbackMessage({ type: "error", text: "Không thể cập nhật vai trò." });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (user: UserSummary) => {
    const nextStatus: UserStatus = user.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const actionText = nextStatus === "DISABLED" ? "khóa" : "mở khóa";

    if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản ${user.email}?`)) {
      return;
    }

    try {
      await updateUserStatus(user.id, nextStatus);
      setFeedbackMessage({
        type: "success",
        text: `Đã ${actionText} tài khoản ${user.email} thành công.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } catch (err) {
      if (err instanceof ApiError) {
        setFeedbackMessage({ type: "error", text: err.message });
      } else {
        setFeedbackMessage({ type: "error", text: "Không thể thay đổi trạng thái tài khoản." });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Quản lý Tài khoản</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Quản trị danh sách người dùng, chuyển đổi vai trò Học viên ↔ Giáo viên và khóa tài khoản
          </p>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`rounded-2xl p-4 text-xs font-semibold ${
            feedbackMessage.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            placeholder="Tìm theo email hoặc họ tên..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white"
          />
        </div>

        <div>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value as UserRole | "");
              setPage(0);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white"
          >
            <option value="">Tất cả vai trò</option>
            <option value="STUDENT">Học viên (STUDENT)</option>
            <option value="TEACHER">Giáo viên (TEACHER)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as UserStatus | "");
              setPage(0);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động (ACTIVE)</option>
            <option value="DISABLED">Bị khóa (DISABLED)</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Đang tải danh sách tài khoản...
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
          Không tìm thấy tài khoản nào phù hợp với điều kiện tìm kiếm.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.content.map((u) => {
                  const isAdmin = u.role === "ADMIN";
                  return (
                    <tr key={u.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{u.fullName || <i>(Chưa cập nhật)</i>}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>

                      <td className="px-6 py-4">
                        {u.role === "ADMIN" ? (
                          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black text-rose-800 border border-rose-200">
                            ADMIN (Duy nhất)
                          </span>
                        ) : u.role === "TEACHER" ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 border border-amber-200">
                            GIÁO VIÊN
                          </span>
                        ) : (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black text-blue-800 border border-blue-200">
                            HỌC VIÊN
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {u.status === "ACTIVE" ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800 border border-red-200">
                            Đã khóa
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {isAdmin ? (
                          <span className="text-[11px] font-bold text-slate-400 italic">
                            Bảo vệ hệ thống
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenRoleModal(u)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-[#003466] transition hover:bg-slate-50 shadow-sm"
                            >
                              Đổi vai trò
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition border ${
                                u.status === "ACTIVE"
                                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              }`}
                            >
                              {u.status === "ACTIVE" ? "Khóa" : "Mở khóa"}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {isRoleModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-black text-slate-900">Thay đổi vai trò người dùng</h2>
            <p className="mt-1 text-xs text-slate-500">
              Cập nhật vai trò cho tài khoản <b>{targetUser.email}</b>
            </p>

            <div className="mt-5 space-y-3">
              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                  newRole === "STUDENT"
                    ? "border-[#003466] bg-blue-50/50 text-[#003466]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="font-bold text-xs">Học viên (STUDENT)</div>
                  <div className="text-[11px] text-slate-500">Luyện câu, thi thử, lưu bookmark và câu sai</div>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={newRole === "STUDENT"}
                  onChange={() => setNewRole("STUDENT")}
                  className="h-4 w-4 text-[#003466]"
                />
              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                  newRole === "TEACHER"
                    ? "border-[#003466] bg-blue-50/50 text-[#003466]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="font-bold text-xs">Giáo viên (TEACHER)</div>
                  <div className="text-[11px] text-slate-500">Bao gồm quyền học viên + Thêm, sửa video Google Drive</div>
                </div>
                <input
                  type="radio"
                  name="role"
                  value="TEACHER"
                  checked={newRole === "TEACHER"}
                  onChange={() => setNewRole("TEACHER")}
                  className="h-4 w-4 text-[#003466]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={handleSaveRole}
                className="rounded-xl bg-[#003466] px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-[#00254a] disabled:opacity-50"
              >
                {isUpdating ? "Đang lưu..." : "Xác nhận lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
