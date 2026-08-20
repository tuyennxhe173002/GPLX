import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuthSession, useAuthSession } from "../../shared/auth/authSession";

const navItems = [
  { to: "/", label: "Trang chu" },
  { to: "/chapters", label: "Theo chuong" },
  { to: "/practice/random", label: "Luyen ngau nhien" },
  { to: "/practice/critical", label: "Cau diem liet" },
  { to: "/bookmarks", label: "Bookmark" },
  { to: "/exam", label: "Thi thu" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuthSession();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">GPLX 2025</p>
              <p className="mt-1 text-lg font-semibold text-slate-950">Nen tang luyen 600 cau ly thuyet</p>
            </div>

            {isAuthenticated && session ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-950">{session.user.fullName}</p>
                  <p className="text-xs text-slate-500">{session.user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearAuthSession();
                    navigate("/");
                  }}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Dang xuat
                </button>
              </div>
            ) : (
              <NavLink to="/auth" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                Dang nhap
              </NavLink>
            )}
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
