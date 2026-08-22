import type { PracticeQuestion } from "../../questions/types/question";
import type { PracticeAnswerResult } from "../types/practice";
import { AnswerOption } from "./AnswerOption";

type PracticeQuestionCardProps = {
  question: PracticeQuestion;
  selectedAnswerId?: number;
  result?: PracticeAnswerResult;
  onSelectAnswer: (answerId: number) => void;
};

export function PracticeQuestionCard({ question, selectedAnswerId, result, onSelectAnswer }: PracticeQuestionCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-xl bg-[#003466] px-3.5 py-1.5 text-sm font-extrabold text-white shadow-sm">
            Câu {question.questionNumber}
          </span>
          {question.chapterCode ? (
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Chương: {question.chapterCode}
            </span>
          ) : null}
        </div>

        {question.isCritical ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1 text-xs font-bold text-red-700 ring-1 ring-inset ring-red-600/20">
            <svg className="h-4 w-4 text-red-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Câu hỏi điểm liệt
          </span>
        ) : null}
      </div>

      <h2 className="mt-5 text-lg font-bold leading-snug text-[#003466] sm:text-xl">
        {question.content}
      </h2>

      {question.imageUrl ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <img
            src={question.imageUrl}
            alt={`Hình minh họa câu ${question.questionNumber}`}
            className="max-h-[380px] w-full rounded-xl object-contain mx-auto"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {question.answers.map((answer) => (
          <AnswerOption
            key={answer.id}
            answer={answer}
            selectedAnswerId={selectedAnswerId}
            result={result}
            onSelect={onSelectAnswer}
          />
        ))}
      </div>
    </section>
  );
}

