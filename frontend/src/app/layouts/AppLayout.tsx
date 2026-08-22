import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession, useAuthSession } from "../../shared/auth/authSession";

const licenseClasses = [
  { code: "B", label: "Hạng B" },
  { code: "C1", label: "Hạng C1" },
  { code: "C", label: "Hạng C" },
  { code: "D1", label: "Hạng D1" },
  { code: "D2", label: "Hạng D2" },
  { code: "D", label: "Hạng D" },
  { code: "CE", label: "Hạng CE" },
  { code: "DE", label: "Hạng DE" },
  { code: "A1", label: "Hạng A1" },
  { code: "A", label: "Hạng A" },
];

function BrandLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#003466] text-white shadow-md">
        <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="3" fill="#003466" />
          <path d="M18 36L28 20L36 32L46 16" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="46" cy="16" r="3" fill="#f59e0b" />
          <path d="M16 46H48" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <span className="text-lg sm:text-xl font-black tracking-tight text-[#003466]">ĐÀO TẠO LÁI XE BẮC HÀ</span>
        <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Hệ Thống Luyện 600 Câu</span>
      </div>
    </div>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();
  const [selectedLicense, setSelectedLicense] = useState<string>(() => {
    return localStorage.getItem("selected_license") || "B";
  });

  useEffect(() => {
    localStorage.setItem("selected_license", selectedLicense);
  }, [selectedLicense]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-900 font-sans antialiased flex flex-col justify-between">
      <div>

        {/* Minimalist Header: Logo on left, Auth & Account on right */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            {/* Left: Brand Logo */}
            <Link to="/" className="transition hover:opacity-90">
              <BrandLogo />
            </Link>

            {/* Right: Account & Auth Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Link
                to="/auth"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-[#003466]"
              >
                Tài khoản
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <span className="hidden md:inline text-xs sm:text-sm font-bold text-slate-600">
                    C5XGDIU
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearAuthSession();
                      navigate("/");
                    }}
                    className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs sm:text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="rounded-xl bg-[#003466] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a]"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="mx-auto max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ selectedLicense }} />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-[1320px] px-4">
          <p className="font-bold text-slate-700">© 2026 ĐÀO TẠO LÁI XE BẮC HÀ - HỆ THỐNG LUYỆN 600 CÂU HỎI LÝ THUYẾT GPLX</p>
        </div>
      </footer>
    </div>
  );
}
