import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PracticeQuestion } from "../../questions/types/question";
import { addBookmark, getBookmarks, removeBookmark } from "../../bookmarks/api/bookmarkApi";
import { getProgressSummary } from "../../progress/api/progressApi";
import { submitPracticeAnswer } from "../api/practiceApi";
import type { PracticeAnswerResult } from "../types/practice";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { SectionHeading } from "../../../shared/components/SectionHeading";
import { queryClient } from "../../../app/queryClient";
import { ApiError } from "../../../shared/api/apiClient";
import { useAuthSession } from "../../../shared/auth/authSession";
import { ExplanationPanel } from "./ExplanationPanel";
import { PracticeQuestionCard } from "./PracticeQuestionCard";
import { QuestionNavigator } from "./QuestionNavigator";

type PracticeSessionViewProps = {
  title: string;
  description: string;
  questions: PracticeQuestion[];
};

export function PracticeSessionView({ title, description, questions }: PracticeSessionViewProps) {
  const { isAuthenticated } = useAuthSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<Record<number, number>>({});
  const [resultsByQuestionId, setResultsByQuestionId] = useState<Record<number, PracticeAnswerResult>>({});

  const currentQuestion = questions[currentIndex];

  const submitMutation = useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: number; answerId: number }) => submitPracticeAnswer(questionId, answerId),
    onSuccess: (result) => {
      setResultsByQuestionId((current) => ({ ...current, [result.questionId]: result }));
      if (isAuthenticated) {
        void queryClient.invalidateQueries({ queryKey: ["me", "progress"] });
        void queryClient.invalidateQueries({ queryKey: ["me", "progress", "chapters"] });
      }
    },
  });

  const bookmarksQuery = useQuery({
    queryKey: ["me", "bookmarks"],
    queryFn: getBookmarks,
    enabled: isAuthenticated,
  });

  const progressSummaryQuery = useQuery({
    queryKey: ["me", "progress"],
    queryFn: getProgressSummary,
    enabled: isAuthenticated,
  });

  const bookmarkMutation = useMutation({
    mutationFn: async ({ questionId, bookmarked }: { questionId: number; bookmarked: boolean }) => {
      if (bookmarked) {
        await removeBookmark(questionId);
        return false;
      }

      await addBookmark(questionId);
      return true;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me", "bookmarks"] });
    },
  });

  const answeredQuestionIds = useMemo(() => Object.keys(resultsByQuestionId).map((value) => Number(value)), [resultsByQuestionId]);
  const bookmarkedQuestionIds = useMemo(() => new Set<number>((bookmarksQuery.data ?? []).map((question: PracticeQuestion) => question.id)), [bookmarksQuery.data]);

  if (questions.length === 0) {
    return <EmptyState title="Chua co cau hoi" description="Tap cau hoi nay hien chua co du lieu de luyen." />;
  }

  if (!currentQuestion) {
    return <ErrorState message="Khong xac dinh duoc cau hoi hien tai." />;
  }

  const selectedAnswerId = selectedAnswerIds[currentQuestion.id];
  const currentResult = resultsByQuestionId[currentQuestion.id];
  const isBookmarked = bookmarkedQuestionIds.has(currentQuestion.id);
  const bookmarkErrorMessage = bookmarkMutation.error instanceof ApiError ? bookmarkMutation.error.message : null;

  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Phase 6" title={title} description={description} />

      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          <PracticeQuestionCard
            question={currentQuestion}
            selectedAnswerId={selectedAnswerId}
            result={currentResult}
            onSelectAnswer={(answerId) => {
              setSelectedAnswerIds((current) => ({ ...current, [currentQuestion.id]: answerId }));
            }}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
              disabled={currentIndex === 0}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cau truoc
            </button>
            <button
              type="button"
              onClick={() => submitMutation.mutate({ questionId: currentQuestion.id, answerId: selectedAnswerId })}
              disabled={!selectedAnswerId || submitMutation.isPending}
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitMutation.isPending ? "Dang cham..." : "Tra loi"}
            </button>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => bookmarkMutation.mutate({ questionId: currentQuestion.id, bookmarked: isBookmarked })}
                disabled={bookmarkMutation.isPending}
                className={`rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isBookmarked ? "bg-amber-100 text-amber-900" : "border border-slate-300 bg-white text-slate-700"
                }`}
              >
                {bookmarkMutation.isPending ? "Dang cap nhat..." : isBookmarked ? "Bo bookmark" : "Danh dau"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
              disabled={currentIndex === questions.length - 1}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cau tiep
            </button>
          </div>

          {submitMutation.isError ? <ErrorState title="Khong cham duoc dap an" message="Vui long thu lai sau it giay." /> : null}
          {bookmarkErrorMessage ? <ErrorState title="Khong cap nhat duoc bookmark" message={bookmarkErrorMessage} /> : null}

          {currentResult ? <ExplanationPanel result={currentResult} /> : null}
        </div>

        <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
          <QuestionNavigator
            currentIndex={currentIndex}
            total={questions.length}
            answeredQuestionIds={answeredQuestionIds}
            questionIds={questions.map((question) => question.id)}
            onSelect={setCurrentIndex}
          />

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Trang thai hien tai</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4">
                <dt>Che do</dt>
                <dd className="font-medium text-slate-900">{title}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Cau hien tai</dt>
                <dd className="font-medium text-slate-900">
                  {currentIndex + 1}/{questions.length}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt>Da cham</dt>
                <dd className="font-medium text-slate-900">{answeredQuestionIds.length}</dd>
              </div>
              {isAuthenticated && progressSummaryQuery.data ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Da luyen toan bo</dt>
                    <dd className="font-medium text-slate-900">{progressSummaryQuery.data.attemptedQuestions}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Bookmark</dt>
                    <dd className="font-medium text-slate-900">{bookmarksQuery.data?.length ?? 0}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
