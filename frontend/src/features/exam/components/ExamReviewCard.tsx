import type { ExamResultQuestion } from "../types/exam";

export function ExamReviewCard({ question }: { question: ExamResultQuestion }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Cau {question.questionNumber}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${question.correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {question.correct ? "Dung" : "Sai"}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600">Ban chon: {question.selectedAnswerId ?? "Chua chon"}</p>
      <p className="mt-1 text-sm text-slate-600">Dap an dung: {question.correctAnswerIds.join(", ")}</p>
      <p className="mt-4 text-sm leading-6 text-slate-700">{question.explanation || "Chua co giai thich chi tiet."}</p>
    </article>
  );
}
