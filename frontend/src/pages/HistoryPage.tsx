import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserHistory } from "../features/progress/api/progressApi";
import { useAuth } from "../features/auth/hooks/useAuth";

export function HistoryPage() {
  const { isAuthenticated } = useAuth();

  const { data: history, isLoading } = useQuery({
    queryKey: ["me", "history"],
    queryFn: getUserHistory,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Lịch sử học tập</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
          Đăng nhập để xem lại lịch sử các lần làm bài thi thử và luyện tập câu hỏi.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-[#003466] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#00254a]"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Lịch sử học tập & thi thử</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Nhật ký làm bài giúp bạn theo dõi tiến bộ từng ngày
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
          Đang tải lịch sử học tập...
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Exam Sessions History */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                1
              </span>
              Lịch sử thi thử gần đây
            </h2>

            {!history?.recentExamSessions || history.recentExamSessions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
                Chưa có bài thi thử nào.
              </div>
            ) : (
              <div className="space-y-3">
                {history.recentExamSessions.map((session) => (
                  <div
                    key={session.sessionId}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Hạng {session.licenseType}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            session.passed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {session.passed ? "ĐẠT" : "KHÔNG ĐẠT"}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {new Date(session.startedAt).toLocaleString("vi-VN")}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-sm text-slate-900">
                        {session.correctCount} / {session.totalQuestions}
                      </div>
                      <Link
                        to={`/exam/${session.sessionId}/result`}
                        className="text-[11px] font-bold text-[#003466] hover:underline"
                      >
                        Xem kết quả &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Practice Attempts History */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-base font-black text-slate-900">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                2
              </span>
              Lịch sử luyện tập gần đây
            </h2>

            {!history?.recentPracticeAttempts || history.recentPracticeAttempts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-xs text-slate-400">
                Chưa có câu hỏi luyện tập nào.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.recentPracticeAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#003466]">
                        Câu {attempt.questionNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          attempt.isCorrect
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {attempt.isCorrect ? "Đúng" : "Sai"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                      {attempt.questionContent}
                    </p>
                    <div className="mt-1 text-[10px] text-slate-400">
                      {new Date(attempt.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
