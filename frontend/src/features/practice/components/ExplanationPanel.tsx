import { useQuery } from "@tanstack/react-query";
import { getPracticeAttemptAnimation } from "../api/practiceApi";
import type { PracticeAnswerResult } from "../types/practice";

type ExplanationPanelProps = {
  result: PracticeAnswerResult;
};

export function ExplanationPanel({ result }: ExplanationPanelProps) {
  const animationQuery = useQuery({
    queryKey: ["practice-animation", result.animation.attemptId],
    queryFn: () => getPracticeAttemptAnimation(result.animation.attemptId),
    enabled: result.animation.available,
  });

  return (
    <section className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-3">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold ${
              result.correct ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {result.correct ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Trả lời đúng
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Trả lời chưa đúng
              </>
            )}
          </span>
        </div>
        <span className="text-xs font-bold text-[#003466]">
          Đáp án đúng: <span className="underline decoration-2 underline-offset-2 font-black">{result.correctAnswerIds.join(", ")}</span>
        </span>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-base font-bold text-[#003466]">
          <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Giải thích chi tiết
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-800 font-medium">
          {result.explanation || "Câu này chưa có lời giải chi tiết trong dữ liệu. Bạn có thể ghi nhớ theo đáp án đúng ở trên."}
        </p>
      </div>

      {result.animation.available ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hình ảnh / Animation giải thích</h4>
          {animationQuery.isLoading ? <p className="mt-2 text-xs text-slate-600">Đang tải mô phỏng...</p> : null}
          {animationQuery.isError ? <p className="mt-2 text-xs text-red-700">Không tải được mô phỏng.</p> : null}
          {animationQuery.data ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {animationQuery.data.backgroundImageUrl ? (
                  <img
                    src={animationQuery.data.backgroundImageUrl}
                    alt="Mô phỏng giải thích"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-xs text-slate-500">Không có hình nền mô phỏng.</div>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-bold">Kích thước: {animationQuery.data.sceneWidth} x {animationQuery.data.sceneHeight}</p>
                <p className="mt-1 font-bold">Thời lượng: {animationQuery.data.durationMs}ms</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

