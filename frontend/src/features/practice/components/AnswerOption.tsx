import type { Answer } from "../../questions/types/question";
import type { PracticeAnswerResult } from "../types/practice";

type AnswerOptionProps = {
  answer: Answer;
  selectedAnswerId?: number;
  result?: PracticeAnswerResult;
  onSelect: (answerId: number) => void;
};

export function AnswerOption({ answer, selectedAnswerId, result, onSelect }: AnswerOptionProps) {
  const isSelected = selectedAnswerId === answer.id;
  const isCorrect = result?.correctAnswerIds.includes(answer.id) ?? false;
  const isWrongSelection = result && isSelected && !isCorrect;

  return (
    <button
      type="button"
      onClick={() => onSelect(answer.id)}
      className={`group relative w-full rounded-2xl border p-4 text-left font-medium transition-all duration-150 shadow-sm ${
        isCorrect
          ? "border-emerald-500 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500/20"
          : isWrongSelection
            ? "border-red-500 bg-red-50/90 text-red-950 ring-2 ring-red-500/20"
            : isSelected
              ? "border-[#003466] bg-[#003466] text-white shadow-md scale-[1.005]"
              : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 hover:shadow"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
            isCorrect
              ? "bg-emerald-600 text-white"
              : isWrongSelection
                ? "bg-red-600 text-white"
                : isSelected
                  ? "bg-white text-[#003466]"
                  : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
          }`}
        >
          {answer.label}
        </span>
        <span className="mt-0.5 text-sm sm:text-base leading-relaxed">{answer.content}</span>
      </div>

      {/* Correct / Incorrect Badges */}
      {isCorrect ? (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : isWrongSelection ? (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

