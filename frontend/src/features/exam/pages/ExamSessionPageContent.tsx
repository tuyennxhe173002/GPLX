import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getExam, saveExamAnswer, submitExam } from "../api/examApi";
import { AnswerOption } from "../../practice/components/AnswerOption";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { ExamNavigator } from "../components/ExamNavigator";
import { ExamTimer } from "../components/ExamTimer";

function getRemainingSeconds(expiresAt: string) {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function ExamSessionPageContent() {
  const navigate = useNavigate();
  const params = useParams();
  const examId = Number(params.sessionId);
  const examQuery = useQuery({
    queryKey: ["exam-session", examId],
    queryFn: () => getExam(examId),
    enabled: Number.isFinite(examId),
    refetchInterval: 30000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<Record<number, number | null>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const saveAnswerMutation = useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: number; answerId: number }) => saveExamAnswer(examId, questionId, answerId),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitExam(examId),
    onSuccess: () => navigate(`/exam/${examId}/result`),
  });

  useEffect(() => {
    if (!examQuery.data) {
      return;
    }
    if (examQuery.data.state === "SUBMITTED" || examQuery.data.state === "EXPIRED") {
      navigate(`/exam/${examId}/result`, { replace: true });
      return;
    }
    setSelectedAnswerIds(
      Object.fromEntries(examQuery.data.questions.map((question) => [question.id, question.selectedAnswerId]))
    );
    setRemainingSeconds(getRemainingSeconds(examQuery.data.expiresAt));
  }, [examId, examQuery.data, navigate]);

  useEffect(() => {
    if (!examQuery.data) {
      return;
    }
    const interval = window.setInterval(() => {
      const nextRemaining = getRemainingSeconds(examQuery.data.expiresAt);
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0 && !submitMutation.isPending) {
        submitMutation.mutate();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [examQuery.data, submitMutation]);

  const currentQuestion = examQuery.data?.questions[currentIndex];
  const selectedQuestionIds = useMemo(
    () => Object.entries(selectedAnswerIds).filter(([, value]) => value != null).map(([id]) => Number(id)),
    [selectedAnswerIds]
  );

  if (examQuery.isLoading) {
    return <LoadingState label="Dang tai bai thi..." />;
  }

  if (examQuery.isError || !examQuery.data || !currentQuestion) {
    return <ErrorState message="Khong tai duoc bai thi hoac bai thi khong ton tai." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{examQuery.data.profileName}</p>
              <h1 className="mt-3 text-xl font-semibold text-slate-950">Cau {currentQuestion.questionNumber}</h1>
              <p className="mt-3 text-base leading-7 text-slate-800">{currentQuestion.content}</p>
            </div>
            {currentQuestion.isCritical ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Diem liet</span> : null}
          </div>

          {currentQuestion.imageUrl ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img src={currentQuestion.imageUrl} alt={`Minh hoa cau ${currentQuestion.questionNumber}`} className="max-h-[420px] w-full object-contain" />
            </div>
          ) : null}

          <div className="mt-6 grid gap-3">
            {currentQuestion.answers.map((answer) => (
              <AnswerOption
                key={answer.id}
                answer={answer}
                selectedAnswerId={selectedAnswerIds[currentQuestion.id] ?? undefined}
                onSelect={(answerId) => {
                  setSelectedAnswerIds((current) => ({ ...current, [currentQuestion.id]: answerId }));
                  saveAnswerMutation.mutate({ questionId: currentQuestion.id, answerId });
                }}
              />
            ))}
          </div>

          {saveAnswerMutation.isError ? <p className="mt-4 text-sm text-red-700">Khong luu duoc dap an. Vui long thu lai.</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
              disabled={currentIndex === 0}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
            >
              Cau truoc
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.min(index + 1, examQuery.data.questions.length - 1))}
              disabled={currentIndex === examQuery.data.questions.length - 1}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
            >
              Cau tiep
            </button>
            <button
              type="button"
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {submitMutation.isPending ? "Dang nop bai..." : "Nop bai"}
            </button>
          </div>
        </section>
      </div>

      <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
        <ExamTimer remainingSeconds={remainingSeconds} profileCode={examQuery.data.profileCode} />
        <ExamNavigator
          currentIndex={currentIndex}
          total={examQuery.data.questions.length}
          selectedQuestionIds={selectedQuestionIds}
          questionIds={examQuery.data.questions.map((question) => question.id)}
          onSelect={setCurrentIndex}
        />
      </div>
    </div>
  );
}
