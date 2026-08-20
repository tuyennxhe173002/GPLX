type QuestionNavigatorProps = {
  currentIndex: number;
  total: number;
  answeredQuestionIds: number[];
  questionIds: number[];
  onSelect: (index: number) => void;
};

export function QuestionNavigator({ currentIndex, total, answeredQuestionIds, questionIds, onSelect }: QuestionNavigatorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Dieu huong cau hoi</h2>
        <span className="text-xs font-medium text-slate-500">
          {answeredQuestionIds.length}/{total} da tra loi
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {questionIds.map((questionId, index) => {
          const answered = answeredQuestionIds.includes(questionId);
          const active = currentIndex === index;
          return (
            <button
              key={questionId}
              type="button"
              onClick={() => onSelect(index)}
              className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                active
                  ? "bg-slate-950 text-white"
                  : answered
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
