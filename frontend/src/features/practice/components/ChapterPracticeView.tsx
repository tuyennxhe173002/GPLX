import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getChapters } from "../../chapters/api/chapterApi";
import { getQuestions } from "../../questions/api/questionApi";
import { submitPracticeAnswer } from "../api/practiceApi";
import type { PracticeQuestion } from "../../questions/types/question";
import type { PracticeAnswerResult } from "../types/practice";
import { ExplanationVideo } from "../../explanation-video/components/ExplanationVideo";
import { AdminVideoInlineEditor } from "../../explanation-video/components/AdminVideoInlineEditor";
import { useAuth } from "../../auth/hooks/useAuth";

type AnsweredState = {
  selectedAnswerId: number;
  isCorrect?: boolean;
  correctAnswerIds?: number[];
  explanation?: string | null;
};

const STORAGE_KEY = "gplx_chapter_practice_progress_v1";

function loadSavedProgress(): Record<number, AnsweredState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<number, AnsweredState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore localstorage quota errors
  }
}

export function ChapterPracticeView() {
  const { role, can } = useAuth();
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mode, setMode] = useState<"study" | "exam">("study"); // "study" = hiện giải thích ngay, "exam" = tự do
  const [showModeModal, setShowModeModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Local progress store: questionId -> AnsweredState
  const [userProgress, setUserProgress] = useState<Record<number, AnsweredState>>(() => loadSavedProgress());

  // Fetch chapters
  const chaptersQuery = useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
  });

  const chapters = useMemo(() => {
    return [...(chaptersQuery.data || [])].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }, [chaptersQuery.data]);

  // Set default selected chapter when chapters load
  useEffect(() => {
    if (chapters.length > 0 && selectedChapterId === null) {
      setSelectedChapterId(chapters[0].id);
    }
  }, [chapters, selectedChapterId]);

  const activeChapterId = selectedChapterId ?? chapters[0]?.id;

  const currentChapterIndex = useMemo(() => {
    const idx = chapters.findIndex((c) => c.id === activeChapterId);
    return idx !== -1 ? idx : 0;
  }, [chapters, activeChapterId]);

  const currentChapter = chapters[currentChapterIndex];

  // Fetch questions for selected chapter
  const questionsQuery = useQuery({
    queryKey: ["chapter-questions", activeChapterId],
    queryFn: () => getQuestions({ chapterId: activeChapterId, page: 0, size: 600 }),
    enabled: activeChapterId !== undefined && activeChapterId !== null,
  });

  const questions = questionsQuery.data?.content || [];
  const currentQuestion: PracticeQuestion | undefined = questions[currentIndex];

  // Answer submission mutation
  const submitMutation = useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: number; answerId: number }) =>
      submitPracticeAnswer(questionId, answerId),
    onSuccess: (res, variables) => {
      const newState: AnsweredState = {
        selectedAnswerId: variables.answerId,
        isCorrect: res.correct,
        correctAnswerIds: res.correctAnswerIds,
        explanation: res.explanation,
      };

      setUserProgress((prev) => {
        const updated = { ...prev, [variables.questionId]: newState };
        saveProgress(updated);
        return updated;
      });
    },
  });

  // Handle switching chapter
  const handleSelectChapter = (chId: number) => {
    setSelectedChapterId(chId);
    setCurrentIndex(0);
  };

  // Handle selecting an answer option
  const handleSelectOption = (answerId: number) => {
    if (!currentQuestion) return;
    submitMutation.mutate({ questionId: currentQuestion.id, answerId });
  };

  // Handle data reset
  const handleResetProgress = () => {
    setUserProgress({});
    localStorage.removeItem(STORAGE_KEY);
    setShowResetModal(false);
  };

  const currentAnsweredState: AnsweredState | undefined = currentQuestion
    ? userProgress[currentQuestion.id]
    : undefined;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ôn tập theo chương
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
            {currentChapter
              ? `Đang học Chương ${currentChapterIndex + 1}: ${currentChapter.name}`
              : "Chọn chương để luyện tập"}
          </p>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowModeModal(true)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Chọn chế độ
          </button>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="rounded-2xl bg-[#d90404] px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
          >
            Xóa dữ liệu
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout matching daotaolaixebd.com */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Sidebar: Chương học (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Chương học
            </h2>

            <div className="space-y-2">
              {chapters.map((ch, idx) => {
                const isActive = ch.id === activeChapterId;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChapter(ch.id)}
                    className={`w-full rounded-2xl p-3.5 text-left text-xs sm:text-sm font-bold transition-all ${isActive
                        ? "border-2 border-amber-500 bg-amber-50/60 text-amber-950 shadow-sm"
                        : "border border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                  >
                    Chương {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center Column: Question Card & Nav (6 cols) */}
        <main className="lg:col-span-6 space-y-4">
          {questionsQuery.isLoading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-500">
              Đang tải danh sách câu hỏi...
            </div>
          ) : questions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-500">
              Không tìm thấy câu hỏi nào trong chương này.
            </div>
          ) : currentQuestion ? (
            <>
              {/* Question Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  Câu: {currentIndex + 1}. {currentQuestion.content}
                </h2>

                {currentQuestion.imageUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center">
                    <img
                      src={currentQuestion.imageUrl}
                      alt={`Hình minh họa câu ${currentIndex + 1}`}
                      onError={(e) => (e.currentTarget.parentElement!.style.display = "none")}
                      className="max-h-72 rounded-xl object-contain mx-auto"
                    />
                  </div>
                ) : null}

                {/* Choices */}
                <div className="space-y-3">
                  {currentQuestion.answers.map((ans, aIdx) => {
                    const isSelected = currentAnsweredState?.selectedAnswerId === ans.id;
                    const isCorrect = currentAnsweredState?.correctAnswerIds?.includes(ans.id);
                    const isWrong = isSelected && currentAnsweredState?.isCorrect === false;

                    let btnStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

                    if (mode === "study" && currentAnsweredState) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm";
                      } else if (isWrong) {
                        btnStyle = "border-red-500 bg-red-50 text-red-950 font-bold shadow-sm";
                      } else if (isSelected) {
                        btnStyle = "border-[#003466] bg-[#003466] text-white font-bold";
                      }
                    } else if (isSelected) {
                      btnStyle = "border-[#003466] bg-[#003466] text-white font-bold";
                    }

                    return (
                      <button
                        key={ans.id}
                        type="button"
                        onClick={() => handleSelectOption(ans.id)}
                        disabled={submitMutation.isPending}
                        className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300">
                          {isSelected ? (
                            <div className="h-3 w-3 rounded-full bg-[#003466]"></div>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-400">{aIdx + 1}</span>
                          )}
                        </div>
                        <span className="leading-relaxed">
                          {aIdx + 1}. {ans.content}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#003466] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a] disabled:opacity-40"
                >
                  <span>|&lt; Câu trước</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex >= questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#003466] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a] disabled:opacity-40"
                >
                  <span>Câu sau &gt;|</span>
                </button>
              </div>
            </>
          ) : null}
        </main>

        {/* Right Sidebar: Giải thích & Question Grid Matrix (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Card 1: Giải thích */}
          <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-[#003466] border-b border-slate-100 pb-2">
              Giải thích
            </h2>

            {currentAnsweredState && mode === "study" ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <p className="font-bold text-[#003466]">
                  Đáp án đúng:{" "}
                  <span className="underline font-black text-emerald-700">
                    {currentAnsweredState.correctAnswerIds
                      ?.map((id) => currentQuestion?.answers.find((a) => a.id === id)?.content || id)
                      .join(", ")}
                  </span>
                </p>
                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {(currentAnsweredState.explanation ||
                    currentQuestion?.explanation ||
                    "Chọn đáp án đúng theo quy tắc hướng dẫn trên.").replace(/\\n/g, "\n")}
                </p>

                {/* Video mô phỏng sa hình nhúng từ Google Drive */}
                {currentQuestion && (
                  <ExplanationVideo
                    questionId={currentQuestion.id}
                    questionNumber={currentIndex + 1}
                  />
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Chọn một đáp án để xem đáp án đúng và phần giải thích của câu hỏi.
              </p>
            )}
          </div>

          {/* Card Admin: Gán link video Google Drive */}
          {currentQuestion && (role === "ADMIN" || can("VIDEO_CREATE") || can("VIDEO_UPDATE")) && (
            <AdminVideoInlineEditor
              questionId={currentQuestion.id}
              questionNumber={currentIndex + 1}
              chapterTitle={currentChapter?.name}
            />
          )}

          {/* Card 2: Question Matrix Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
              Chương {currentChapterIndex + 1}: {currentChapter?.name}
            </h2>

            {/* 5-Column Question Number Matrix */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, qIdx) => {
                const isCurrent = qIdx === currentIndex;
                const isAnswered = Boolean(userProgress[q.id]);
                const ansState = userProgress[q.id];

                let badgeStyle = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50";

                if (isCurrent) {
                  // Current question being viewed: Orange/Amber background matching user's screenshot
                  badgeStyle = "bg-[#f59e0b] text-white font-black shadow-md border-2 border-amber-600 scale-105";
                } else if (isAnswered) {
                  // "Khi làm được câu nào sẽ bôi đậm số câu đó như ảnh": Bold green badge
                  badgeStyle = ansState?.isCorrect
                    ? "bg-emerald-100 text-emerald-950 font-black border-2 border-emerald-600 shadow-sm"
                    : "bg-red-100 text-red-950 font-black border-2 border-red-500 shadow-sm";
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(qIdx)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl text-xs sm:text-sm transition-all ${badgeStyle}`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Mode Selector Modal */}
      {showModeModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
              Chọn chế độ học
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMode("study");
                  setShowModeModal(false);
                }}
                className={`w-full rounded-2xl border p-4 text-left font-bold text-xs sm:text-sm transition ${mode === "study"
                    ? "border-[#003466] bg-[#003466] text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
              >
                Chế độ Ôn tập (Hiện ngay giải thích & đáp án)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("exam");
                  setShowModeModal(false);
                }}
                className={`w-full rounded-2xl border p-4 text-left font-bold text-xs sm:text-sm transition ${mode === "exam"
                    ? "border-[#003466] bg-[#003466] text-white"
                    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                  }`}
              >
                Chế độ Tự luyện / Thi thử (Không hiện giải thích lập tức)
              </button>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowModeModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Reset Progress Confirmation Modal */}
      {showResetModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-red-600 border-b border-slate-100 pb-2">
              Xóa dữ liệu tiến độ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Bạn có chắc chắn muốn xóa toàn bộ lịch sử các câu đã làm trong phần ôn tập theo chương?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleResetProgress}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
