import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const roleBadge = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-800 border border-rose-200">Quản Trị Viên</span>;
      case "TEACHER":
        return <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800 border border-amber-200">Giáo Viên</span>;
      default:
        return <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800 border border-blue-200">Học Viên</span>;
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-6 sm:py-10 space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#003466] to-[#005bb5] text-xl font-black text-white shadow-md">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.fullName}</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">{user.email}</p>
              <div className="mt-2">{roleBadge(user.role)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs sm:text-sm">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Trạng thái</span>
            <span className="mt-1 block font-bold text-emerald-600">Hoạt động bình thường</span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Đổi mật khẩu</span>
            <Link to="/change-password" className="mt-1 block font-bold text-[#003466] hover:underline">
              Cập nhật mật khẩu &rarr;
            </Link>
          </div>
        </div>

        {user.permissions && user.permissions.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quyền hạn tài khoản</h2>
            <div className="flex flex-wrap gap-1.5">
              {user.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 border border-slate-200/60"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <Link
            to="/change-password"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Đổi mật khẩu
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 border border-red-200"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
