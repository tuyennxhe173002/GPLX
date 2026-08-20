import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";
import { SectionHeading } from "../../../shared/components/SectionHeading";
import { ApiError } from "../../../shared/api/apiClient";
import { clearAuthSession, setAuthSession, useAuthSession } from "../../../shared/auth/authSession";

type AuthMode = "login" | "register";

export function AuthPageContent() {
  const navigate = useNavigate();
  const { session, isAuthenticated } = useAuthSession();
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authMutation = useMutation({
    mutationFn: async () => {
      if (mode === "login") {
        return login({ email, password });
      }

      return register({ fullName, email, password });
    },
    onSuccess: (response) => {
      setAuthSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });
      navigate("/");
    },
  });

  if (isAuthenticated && session) {
    return (
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Tai khoan"
          title={`Xin chao, ${session.user.fullName}`}
          description="Frontend da luu access token, refresh token va tu dong refresh khi token het han."
        />

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ho ten</dt>
              <dd className="mt-2 text-base font-medium text-slate-950">{session.user.fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Email</dt>
              <dd className="mt-2 text-base font-medium text-slate-950">{session.user.email}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              navigate("/");
            }}
            className="mt-6 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Dang xuat
          </button>
        </section>
      </div>
    );
  }

  const errorMessage = authMutation.error && authMutation.error instanceof ApiError ? authMutation.error.message : "Khong the xac thuc. Vui long thu lai.";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-xl sm:p-10">
        <SectionHeading
          eyebrow="Auth"
          title="Dang nhap de dong bo tien do va bookmark"
          description="Backend da co auth, progress va bookmark theo tung user. Frontend nay luu session tren localStorage va tu dong refresh token khi can."
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex gap-2 rounded-full bg-slate-100 p-1">
          {[
            ["login", "Dang nhap"],
            ["register", "Dang ky"],
          ].map(([nextMode, label]) => (
            <button
              key={nextMode}
              type="button"
              onClick={() => setMode(nextMode as AuthMode)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === nextMode ? "bg-slate-950 text-white" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            authMutation.mutate();
          }}
        >
          {mode === "register" ? (
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Ho va ten</span>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
                placeholder="Nguyen Van A"
                required
              />
            </label>
          ) : null}

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
              placeholder="user@example.com"
              required
            />
          </label>

          <label className="block text-sm text-slate-700">
            <span className="mb-2 block font-medium">Mat khau</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-950"
              placeholder="Toi thieu 8 ky tu"
              minLength={8}
              required
            />
          </label>

          {authMutation.isError ? <p className="text-sm text-red-700">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={authMutation.isPending}
            className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {authMutation.isPending ? "Dang xu ly..." : mode === "login" ? "Dang nhap" : "Tao tai khoan"}
          </button>
        </form>
      </section>
    </div>
  );
}
