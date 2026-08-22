import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "../../questions/api/questionApi";
import type { PracticeQuestion } from "../../questions/types/question";
import { LICENSE_CONFIGS, getExamQuestionNumbers } from "../data/examRules";
import { SaHinhRealistic3DPlayer } from "../../practice/components/SaHinhRealistic3DPlayer";
import { getSaHinhSimulation } from "../../practice/data/saHinhSimulationData";

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function ExamRunnerView() {
  const navigate = useNavigate();
  const params = useParams();
  const licenseCode = (params.license || "b").toUpperCase();
  const examId = Number(params.examId || 1);
  const config = LICENSE_CONFIGS[licenseCode] || LICENSE_CONFIGS.B;

  // 1. Fetch all questions to map exam test questions
  const allQuestionsQuery = useQuery({
    queryKey: ["all-questions-600"],
    queryFn: () => getQuestions({ page: 0, size: 600 }),
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const allQuestions = allQuestionsQuery.data?.content || [];

  // 2. Resolve exam test question list
  const examQuestions: PracticeQuestion[] = useMemo(() => {
    if (allQuestions.length === 0) return [];
    const questionNumbers = getExamQuestionNumbers(licenseCode, examId);
    if (questionNumbers.length === 0) {
      return allQuestions.slice(0, config.totalQuestions);
    }
    const qMap = new Map<number, PracticeQuestion>();
    allQuestions.forEach((q) => qMap.set(q.questionNumber, q));
    return questionNumbers
      .map((num) => qMap.get(num))
      .filter((q): q is PracticeQuestion => Boolean(q));
  }, [allQuestions, licenseCode, examId, config.totalQuestions]);

  // Exam States
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({}); // questionId -> answerId
  const [remainingSeconds, setRemainingSeconds] = useState<number>(config.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);

  // Timer interval
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Handle select answer
  const handleSelectAnswer = (questionId: number, answerId: number) => {
    if (isSubmitted && !isReviewMode) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  // Submit Exam
  const handleSubmitExam = () => {
    setIsSubmitted(true);
    setShowResultModal(true);
  };

  // Reset / Retry
  const handleRetryExam = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setRemainingSeconds(config.durationMinutes * 60);
    setIsSubmitted(false);
    setShowResultModal(false);
    setIsReviewMode(false);
  };

  // Calculate Results
  const resultStats = useMemo(() => {
    if (!isSubmitted || examQuestions.length === 0) {
      return { score: 0, total: examQuestions.length, isPassed: false, hasWrongCritical: false, wrongCriticalCount: 0 };
    }

    let score = 0;
    let hasWrongCritical = false;
    let wrongCriticalCount = 0;

    examQuestions.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      // Check correct answer
      // In practice question response, if options are present, the option with the matching answer or correct label
      // Note: If correctAnswerIds are provided or if label matching:
      // Let's verify: In PracticeQuestion, we find if chosen answer is correct
      const selectedAns = q.answers.find((a) => a.id === selectedId);
      // If we don't have isCorrect directly on PracticeAnswer, let's look at sortOrder or check:
      // When backend exports questions, correct answer is known. In our app question structure:
      // Let's check correctness:
      const isCorrect = Boolean((selectedAns as any)?.isCorrect);
      
      // Fallback: If isCorrect is not embedded in client side DTO, we can check or grade:
      if (isCorrect) {
        score++;
      } else {
        if (q.isCritical) {
          hasWrongCritical = true;
          wrongCriticalCount++;
        }
      }
    });

    const isPassed = score >= config.minPassingScore && !hasWrongCritical;

    return {
      score,
      total: examQuestions.length,
      isPassed,
      hasWrongCritical,
      wrongCriticalCount,
    };
  }, [isSubmitted, examQuestions, selectedAnswers, config.minPassingScore]);

  const currentQuestion: PracticeQuestion | undefined = examQuestions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const saHinhSim = useMemo(() => {
    if (!currentQuestion) return null;
    return getSaHinhSimulation(
      currentQuestion.questionNumber,
      currentQuestion.content,
      currentQuestion.explanation
    );
  }, [currentQuestion]);

  if (allQuestionsQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-500">
        Đang tải dữ liệu bộ đề thi...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to={`/exam?license=${licenseCode}`}
              className="text-xs font-bold text-slate-500 hover:text-[#003466] flex items-center gap-1"
            >
              ← Chọn đề khác
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#001b3d] tracking-tight">
              {config.name} - Đề số {examId}
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
            {isReviewMode
              ? "Chế độ xem lại bài làm (Có đáp án & giải thích chi tiết)"
              : `Thời gian làm bài: ${config.durationMinutes} phút | Yêu cầu đạt: ${config.minPassingScore}/${config.totalQuestions} câu`}
          </p>
        </div>

        {/* Right Actions: Timer & Submit */}
        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <div className={`rounded-2xl border px-4 py-2 text-sm sm:text-base font-black shadow-sm flex items-center gap-2 ${
              remainingSeconds <= 120
                ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                : "border-slate-300 bg-white text-[#003466]"
            }`}>
              <span>⏱️</span>
              <span>{formatTimer(remainingSeconds)}</span>
            </div>
          ) : (
            <span className="rounded-2xl bg-slate-100 px-4 py-2 text-xs sm:text-sm font-bold text-slate-700">
              Đã nộp bài
            </span>
          )}

          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmitExam}
              className="rounded-2xl bg-red-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-red-700 hover:scale-105 active:scale-95"
            >
              Nộp bài thi
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowResultModal(true)}
              className="rounded-2xl bg-[#003466] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a]"
            >
              Xem kết quả
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Exam Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left/Center Column: Question Card (8 cols) */}
        <main className="lg:col-span-8 space-y-4">
          {currentQuestion ? (
            <>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-[#003466]">
                      Câu {currentIndex + 1} / {examQuestions.length}
                    </span>
                    {currentQuestion.isCritical ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 border border-red-200">
                        ⚠️ CÂU ĐIỂM LIỆT
                      </span>
                    ) : null}
                  </div>

                  <span className="text-xs font-bold text-slate-400">
                    Mã câu: #{currentQuestion.questionNumber}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  Câu: {currentIndex + 1}. {currentQuestion.content}
                </h2>

                {currentQuestion.imageUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2 text-center">
                    <img
                      src={currentQuestion.imageUrl}
                      alt={`Hình minh họa câu ${currentIndex + 1}`}
                      className="max-h-72 rounded-xl object-contain mx-auto"
                    />
                  </div>
                ) : null}

                {/* Choices */}
                <div className="space-y-3">
                  {currentQuestion.answers.map((ans, aIdx) => {
                    const isSelected = selectedAnswers[currentQuestion.id] === ans.id;
                    let btnStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";

                    if (isReviewMode) {
                      // Review Mode: Show correct in green, wrong in red
                      const isCorrect = (ans as any).isCorrect;
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "border-red-500 bg-red-50 text-red-950 font-bold shadow-sm";
                      }
                    } else if (isSelected) {
                      btnStyle = "border-[#003466] bg-[#003466] text-white font-bold shadow-sm";
                    }

                    return (
                      <button
                        key={ans.id}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQuestion.id, ans.id)}
                        disabled={isSubmitted && !isReviewMode}
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

                {/* Explanation in Review Mode */}
                {isReviewMode ? (
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 space-y-3 text-xs sm:text-sm">
                    <h4 className="font-extrabold text-[#003466]">💡 Giải thích chi tiết:</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      {currentQuestion.explanation || "Đáp án chuẩn theo bộ quy tắc giao thông đường bộ."}
                    </p>

                    {/* 3D Animated Sa Hình Simulation Player */}
                    {saHinhSim ? (
                      <div className="pt-3 border-t border-blue-200/60">
                        <SaHinhRealistic3DPlayer
                          questionNumber={currentQuestion.questionNumber}
                          content={currentQuestion.content}
                          explanation={currentQuestion.explanation}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Bottom Nav Buttons */}
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
                  disabled={currentIndex >= examQuestions.length - 1}
                  onClick={() => setCurrentIndex((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#003466] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#00254a] disabled:opacity-40"
                >
                  <span>Câu sau &gt;|</span>
                </button>
              </div>
            </>
          ) : null}
        </main>

        {/* Right Sidebar: Question Matrix Grid (4 cols) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Danh sách câu hỏi
              </h2>
              <span className="text-xs font-bold text-slate-500">
                Đã làm: {answeredCount}/{examQuestions.length}
              </span>
            </div>

            {/* 5-Column Matrix */}
            <div className="grid grid-cols-5 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {examQuestions.map((q, qIdx) => {
                const isCurrent = qIdx === currentIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                let badgeStyle = "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50";

                if (isCurrent) {
                  badgeStyle = "bg-[#fcab28] text-amber-950 font-black border-2 border-[#003466] shadow-sm scale-105";
                } else if (isReviewMode) {
                  const selectedId = selectedAnswers[q.id];
                  const selectedAns = q.answers.find((a) => a.id === selectedId);
                  const isCorrect = Boolean((selectedAns as any)?.isCorrect);
                  badgeStyle = isCorrect
                    ? "bg-emerald-100 text-emerald-950 font-black border border-emerald-500"
                    : "bg-red-100 text-red-950 font-black border border-red-500";
                } else if (isAnswered) {
                  badgeStyle = "bg-[#003466] text-white font-black shadow-xs";
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

      {/* Result Dialog Modal */}
      {showResultModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            {/* Pass / Fail Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-inner bg-slate-50">
              {resultStats.isPassed ? "🎉" : "❌"}
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {resultStats.isPassed ? "CHÚC MỪNG! BẠN ĐÃ ĐẠT BÀI THI!" : "BẠN CHƯA ĐẠT"}
              </h3>
              <p className="mt-2 text-sm text-slate-600 font-medium">
                Bạn đã hoàn thành đề thi số {examId} - {config.name}
              </p>
            </div>

            {/* Score Card */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-2">
              <div className="text-3xl font-black text-[#003466]">
                {resultStats.score} / {resultStats.total} câu
              </div>
              <p className="text-xs font-semibold text-slate-500">
                (Yêu cầu đạt từ {config.minPassingScore}/{resultStats.total} câu và không sai câu điểm liệt)
              </p>

              {resultStats.hasWrongCritical ? (
                <div className="mt-3 rounded-xl bg-red-100 border border-red-300 p-3 text-xs font-bold text-red-700">
                  ⚠️ Bạn đã làm sai câu điểm liệt nên không đạt bài thi!
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowResultModal(false);
                  setIsReviewMode(true);
                }}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                Xem lại bài làm
              </button>

              <button
                type="button"
                onClick={handleRetryExam}
                className="rounded-2xl bg-amber-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-400"
              >
                Làm lại đề này
              </button>

              <Link
                to={`/exam?license=${licenseCode}`}
                className="rounded-2xl bg-[#003466] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#00254a] flex items-center justify-center"
              >
                Chọn đề khác
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
