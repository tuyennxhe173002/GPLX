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
      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
        isCorrect
          ? "border-emerald-300 bg-emerald-50"
          : isWrongSelection
            ? "border-red-300 bg-red-50"
            : isSelected
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isSelected && !result ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          {answer.label}
        </span>
        <span className="text-sm leading-6">{answer.content}</span>
      </div>
    </button>
  );
}
