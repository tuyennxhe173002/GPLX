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
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
            result.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          {result.correct ? "Tra loi dung" : "Tra loi sai"}
        </span>
        <span className="text-sm text-slate-500">Dap an dung: {result.correctAnswerIds.join(", ")}</span>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-950">Loi giai</h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{result.explanation || "Cau hoi nay chua co noi dung loi giai chi tiet."}</p>
      </div>

      {result.animation.available ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-900">Du lieu animation explanation</h4>
          {animationQuery.isLoading ? <p className="mt-2 text-sm text-slate-600">Dang tai animation...</p> : null}
          {animationQuery.isError ? <p className="mt-2 text-sm text-red-700">Khong tai duoc animation explanation.</p> : null}
          {animationQuery.data ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {animationQuery.data.backgroundImageUrl ? (
                  <img
                    src={animationQuery.data.backgroundImageUrl}
                    alt="Background animation explanation"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-500">Khong co background image.</div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
                <p>
                  Scene: {animationQuery.data.sceneWidth} x {animationQuery.data.sceneHeight}
                </p>
                <p className="mt-1">Duration: {animationQuery.data.durationMs}ms</p>
                <pre className="mt-3 max-h-48 overflow-auto rounded-xl bg-slate-950 p-3 text-[11px] text-slate-100">
                  {JSON.stringify(animationQuery.data.animationData, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
