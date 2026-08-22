type QuestionNavigatorProps = {
  currentIndex: number;
  total: number;
  answeredQuestionIds: number[];
  questionIds: number[];
  onSelect: (index: number) => void;
};

export function QuestionNavigator({ currentIndex, total, answeredQuestionIds, questionIds, onSelect }: QuestionNavigatorProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-[#003466] uppercase tracking-wider">Lưới câu hỏi ({total})</h2>
        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#003466]">
          {answeredQuestionIds.length}/{total} đã làm
        </span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {questionIds.map((questionId, index) => {
          const answered = answeredQuestionIds.includes(questionId);
          const active = currentIndex === index;
          return (
            <button
              key={questionId}
              type="button"
              onClick={() => onSelect(index)}
              className={`flex h-10 w-full items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm ${
                active
                  ? "bg-[#003466] text-white ring-2 ring-[#003466] ring-offset-2 scale-105"
                  : answered
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-around border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#003466]"></span> Đang làm
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Đã chọn
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span> Chưa làm
        </span>
      </div>
    </div>
  );
}

