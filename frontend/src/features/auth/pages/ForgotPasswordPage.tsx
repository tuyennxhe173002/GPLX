import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { ApiError } from "../../../shared/api/apiClient";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await forgotPassword({ email });
      setSuccessMessage(response.message);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Không thể gửi yêu cầu. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#003466] to-[#005bb5] text-white shadow-lg shadow-blue-900/20">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Quên mật khẩu</h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Nhập email tài khoản của bạn để nhận liên kết đặt lại mật khẩu
          </p>
        </div>

        {successMessage ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
              {successMessage}
            </div>
            <p className="text-center text-xs text-slate-500">
              Vui lòng kiểm tra email (hoặc liên hệ Quản trị viên hệ thống) để tiếp tục.
            </p>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-block rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nhap-email@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#003466] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-[#003466] to-[#004f98] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:from-[#00284f] hover:to-[#003f7a] disabled:opacity-60"
              >
                {isLoading ? "Đang gửi yêu cầu..." : "Gửi hướng dẫn đặt lại"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Nhớ lại mật khẩu?{" "}
              <Link to="/login" className="font-bold text-[#003466] hover:underline">
                Đăng nhập ngay
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
