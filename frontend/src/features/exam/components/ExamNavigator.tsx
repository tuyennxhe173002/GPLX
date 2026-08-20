type ExamNavigatorProps = {
  currentIndex: number;
  total: number;
  selectedQuestionIds: number[];
  questionIds: number[];
  onSelect: (index: number) => void;
};

export function ExamNavigator({ currentIndex, total, selectedQuestionIds, questionIds, onSelect }: ExamNavigatorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-slate-900">Navigator bai thi</h2>
        <span className="text-xs text-slate-500">{selectedQuestionIds.length}/{total} da chon</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {questionIds.map((questionId, index) => {
          const active = currentIndex === index;
          const selected = selectedQuestionIds.includes(questionId);
          return (
            <button
              key={questionId}
              type="button"
              onClick={() => onSelect(index)}
              className={`h-10 w-10 rounded-full text-sm font-semibold ${
                active ? "bg-slate-950 text-white" : selected ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
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
