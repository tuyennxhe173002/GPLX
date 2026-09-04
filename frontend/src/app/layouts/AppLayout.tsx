import { useState, useEffect, useRef } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[#003466] text-white shadow-md">
        <svg viewBox="0 0 64 64" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="3" fill="#003466" />
          <path d="M18 36L28 20L36 32L46 16" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="46" cy="16" r="3" fill="#f59e0b" />
          <path d="M16 46H48" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <span className="text-base sm:text-lg font-black tracking-tight text-[#003466] block leading-tight">
          ĐÀO TẠO LÁI XE BẮC HÀ
        </span>
        <span className="block text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Hệ Thống Luyện 600 Câu
        </span>
      </div>
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, role, can, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedLicense, setSelectedLicense] = useState<string>(() => {
    return localStorage.getItem("selected_license") || "B";
  });

  useEffect(() => {
    localStorage.setItem("selected_license", selectedLicense);
  }, [selectedLicense]);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition ${
      isActive
        ? "bg-blue-50 text-[#003466]"
        : "text-slate-600 hover:text-[#003466] hover:bg-slate-50"
    }`;

  const roleLabel = () => {
    switch (role) {
      case "ADMIN":
        return <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-black text-rose-800">Admin</span>;
      case "TEACHER":
        return <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">Giáo viên</span>;
      default:
        return <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-black text-blue-800">Học viên</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div>
        {/* Main Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
            {/* Left: Brand Logo */}
            <Link to="/" className="transition hover:opacity-90 shrink-0">
              <BrandLogo />
            </Link>

            {/* Center: Desktop Navigation Bar */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <NavLink to="/" className={navLinkClass}>Trang chủ</NavLink>
              <NavLink to="/theory/600-cau" className={navLinkClass}>600 câu</NavLink>
              <NavLink to="/exam" className={navLinkClass}>Thi thử</NavLink>
              <NavLink to="/theory/cau-diem-liet" className={navLinkClass}>Điểm liệt</NavLink>

              {/* Conditional capabilities for logged in users */}
              {isAuthenticated && (
                <>
                  <NavLink to="/wrong-questions" className={navLinkClass}>Câu sai</NavLink>
                  <NavLink to="/bookmarks" className={navLinkClass}>Đã đánh dấu</NavLink>
                  <NavLink to="/history" className={navLinkClass}>Lịch sử</NavLink>
                </>
              )}

              {/* Teacher / Admin: Video Management */}
              {(can("VIDEO_CREATE") || role === "TEACHER" || role === "ADMIN") && (
                <NavLink to="/videos" className={navLinkClass}>Quản lý video</NavLink>
              )}

              {/* Admin only: Accounts & Role-Permissions */}
              {(can("ACCOUNT_VIEW") || role === "ADMIN") && (
                <NavLink to="/admin/users" className={navLinkClass}>Tài khoản</NavLink>
              )}
              {(can("ROLE_PERMISSION_VIEW") || role === "ADMIN") && (
                <NavLink to="/admin/roles" className={navLinkClass}>Phân quyền</NavLink>
              )}
            </nav>

            {/* Right: Auth / User Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 transition hover:bg-slate-100 hover:border-slate-300"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#003466] to-[#005bb5] text-xs font-black text-white shadow-sm">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {user.fullName || user.email}
                      </div>
                      <div className="mt-0.5">{roleLabel()}</div>
                    </div>
                    <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="border-b border-slate-100 px-4 py-2">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.fullName}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        <div className="mt-1.5">{roleLabel()}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Hồ sơ cá nhân
                        </Link>

                        <Link
                          to="/change-password"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          Đổi mật khẩu
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                            navigate("/");
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-[#003466]"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-[#003466] px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a]"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="lg:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Trang chủ</NavLink>
              <NavLink to="/theory/600-cau" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>600 câu</NavLink>
              <NavLink to="/exam" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Thi thử</NavLink>
              <NavLink to="/theory/cau-diem-liet" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Điểm liệt</NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/wrong-questions" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Câu sai</NavLink>
                  <NavLink to="/bookmarks" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Đã đánh dấu</NavLink>
                  <NavLink to="/history" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Lịch sử</NavLink>
                </>
              )}

              {(can("VIDEO_CREATE") || role === "TEACHER" || role === "ADMIN") && (
                <NavLink to="/videos" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Quản lý video</NavLink>
              )}
              {(can("ACCOUNT_VIEW") || role === "ADMIN") && (
                <NavLink to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Tài khoản</NavLink>
              )}
              {(can("ROLE_PERMISSION_VIEW") || role === "ADMIN") && (
                <NavLink to="/admin/roles" onClick={() => setIsMobileMenuOpen(false)} className={navLinkClass}>Phân quyền</NavLink>
              )}
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ selectedLicense }} />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-[1360px] px-4">
          <p className="font-bold text-slate-700">© 2026 ĐÀO TẠO LÁI XE BẮC HÀ - HỆ THỐNG LUYỆN 600 CÂU HỎI LÝ THUYẾT GPLX</p>
        </div>
      </footer>
    </div>
  );
}
