import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getWrongQuestions } from "../api/progressApi";
import { useAuth } from "../../auth/hooks/useAuth";
import { PracticeSessionView } from "../../practice/components/PracticeSessionView";
import type { PracticeQuestion } from "../../questions/types/question";

type WrongFilterTab = "all" | "need_review";

export function WrongQuestionsPageContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<WrongFilterTab>("need_review");
  const [isPracticing, setIsPracticing] = useState(false);

  const { data: wrongQuestions, isLoading } = useQuery({
    queryKey: ["me", "wrong-questions"],
    queryFn: getWrongQuestions,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#003466]">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-slate-900">Cần đăng nhập tài khoản</h2>
        <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
          Đăng nhập hoặc đăng ký tài khoản để hệ thống tự động ghi nhận các câu bạn đã trả lời sai và hỗ trợ ôn tập lại.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-[#003466] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#00254a]"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Đăng ký học viên
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
        Đang tải danh sách câu sai...
      </div>
    );
  }

  const allItems = wrongQuestions || [];
  const needReviewItems = allItems.filter((q) => q.lastCorrect === false);
  const currentList = activeTab === "all" ? allItems : needReviewItems;

  const practiceQuestions: PracticeQuestion[] = currentList.map((item) => ({
    id: item.questionId,
    questionNumber: item.questionNumber,
    chapterId: item.chapterId,
    chapterCode: item.chapterCode,
    content: item.content,
    imageUrl: item.imageUrl,
    questionType: item.questionType,
    isCritical: item.isCritical,
    hasAnimation: item.hasAnimation,
    answers: item.answers,
  }));

  if (isPracticing && practiceQuestions.length > 0) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setIsPracticing(false)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          &larr; Quay lại danh sách câu sai
        </button>
        <PracticeSessionView
          title={activeTab === "all" ? "Luyện tất cả câu từng sai" : "Ôn tập câu cần làm lại"}
          description="Luyện tập giúp củng cố kiến thức và làm chủ các câu hỏi khó."
          questions={practiceQuestions}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Danh sách câu sai</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hệ thống tự động lưu các câu hỏi bạn từng trả lời sai để tiện ôn tập lại
          </p>
        </div>

        {currentList.length > 0 && (
          <button
            type="button"
            onClick={() => setIsPracticing(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-rose-900/20 transition hover:from-red-700 hover:to-rose-800"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            <span>Luyện tập ngay ({currentList.length} câu)</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("need_review")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "need_review"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Cần ôn lại ({needReviewItems.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === "all"
              ? "bg-[#003466] text-white shadow-md shadow-blue-900/20"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Tất cả câu từng sai ({allItems.length})
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-800">
            {activeTab === "need_review"
              ? "Tuyệt vời! Bạn không còn câu nào cần ôn lại."
              : "Bạn chưa từng trả lời sai câu hỏi nào."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Tiếp tục làm bài thi thử hoặc luyện 600 câu để duy trì phong độ.
          </p>
          <Link
            to="/exam"
            className="mt-4 inline-block rounded-xl bg-[#003466] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#00254a]"
          >
            Thi thử ngay &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentList.map((item) => (
            <div
              key={item.questionId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-[#003466] px-2.5 py-1 text-xs font-extrabold text-white">
                    Câu {item.questionNumber}
                  </span>
                  {item.isCritical && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                      Điểm liệt
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">
                    Số lần sai: <b className="text-red-600">{item.wrongCount}</b>
                  </span>
                  <span className="text-slate-500">
                    Số lần đúng: <b className="text-emerald-600">{item.correctCount}</b>
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.lastCorrect
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {item.lastCorrect ? "Lần gần nhất: ĐÚNG" : "Lần gần nhất: SAI"}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-900 leading-snug">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
