import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getExamResult } from "../api/examApi";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { SectionHeading } from "../../../shared/components/SectionHeading";
import { ExamReviewCard } from "../components/ExamReviewCard";

export function ExamResultPageContent() {
  const params = useParams();
  const examId = Number(params.sessionId);
  const resultQuery = useQuery({
    queryKey: ["exam-result", examId],
    queryFn: () => getExamResult(examId),
    enabled: Number.isFinite(examId),
  });

  if (resultQuery.isLoading) {
    return <LoadingState label="Dang tai ket qua bai thi..." />;
  }

  if (resultQuery.isError || !resultQuery.data) {
    return <ErrorState message="Khong tai duoc ket qua bai thi." />;
  }

  const wrongQuestions = resultQuery.data.questions.filter((question) => !question.correct);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Phase 9"
        title={`Ket qua thi ${resultQuery.data.profileCode}`}
        description="Ket qua duoc cham tren server sau khi bai thi duoc submit hoac het gio."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        <div className={`rounded-3xl border p-6 shadow-sm ${resultQuery.data.passed ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Pass / Fail</p>
          <p className={`mt-3 text-3xl font-bold ${resultQuery.data.passed ? "text-emerald-800" : "text-red-800"}`}>
            {resultQuery.data.passed ? "Dat" : "Chua dat"}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Diem</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resultQuery.data.score}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Sai diem liet</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{resultQuery.data.criticalWrongCount}</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-950">Review cau tra loi sai</h2>
        {wrongQuestions.length === 0 ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800 shadow-sm">
            Ban khong co cau sai nao trong bai thi nay.
          </div>
        ) : (
          <div className="grid gap-4">
            {wrongQuestions.map((question) => (
              <ExamReviewCard key={question.questionId} question={question} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
