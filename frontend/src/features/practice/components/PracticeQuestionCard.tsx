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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">Cau {question.questionNumber}</p>
          <h2 className="mt-3 text-xl font-semibold leading-8 text-slate-950">{question.content}</h2>
        </div>
        {question.isCritical ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Diem liet</span> : null}
      </div>

      {question.imageUrl ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          <img src={question.imageUrl} alt={`Minh hoa cau ${question.questionNumber}`} className="max-h-[420px] w-full object-contain" />
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
