import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import mnemonicsData from "../features/mnemonics/data/mnemonics.json";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQuestionByNumber } from "../features/questions/api/questionApi";
import { submitPracticeAnswer } from "../features/practice/api/practiceApi";
import type { PracticeQuestion } from "../features/questions/types/question";
import type { PracticeAnswerResult } from "../features/practice/types/practice";

type Rule = {
  question: string;
  answer: string;
};

type StatusItem = {
  imageName: string;
  label: string;
};

type Section = {
  kind?: string;
  text?: string;
  imageUrl?: string;
  numbers?: number[];
  items?: StatusItem[];
};

type TipItem = {
  id: string;
  text?: string;
  title?: string;
  type?: string;
  rules?: Rule[];
  description?: string;
  sections?: Section[];
  exampleQuestions?: number[];
};

type Category = {
  id: number;
  title: string;
  color: string;
  tips: TipItem[];
};

export function MnemonicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id) || 1;

  // Active question per tip section for inline viewing
  const [activeInlineQuestions, setActiveInlineQuestions] = useState<Record<string, number | null>>({});

  const categories = (mnemonicsData as { categories: Category[] }).categories;
  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId) || categories[0];
  }, [categories, categoryId]);

  const toggleInlineQuestion = (tipId: string, qNum: number) => {
    setActiveInlineQuestions((prev) => ({
      ...prev,
      [tipId]: prev[tipId] === qNum ? null : qNum,
    }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Category Header */}
      <section
        className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg sm:p-8"
        style={{ backgroundColor: currentCategory.color }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/mnemonics"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur transition hover:bg-white/30"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Quay lại danh sách mẹo
            </Link>
            <h1 className="mt-3 text-2xl font-black sm:text-3xl tracking-tight">
              {currentCategory.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm opacity-90 font-medium">
              Tổng hợp {currentCategory.tips.length} quy tắc mẹo giải nhanh chuẩn 600 câu GPLX
            </p>
          </div>
        </div>
      </section>

      {/* Category Navigation Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {categories.map((cat) => {
          const isActive = cat.id === categoryId;
          return (
            <Link
              key={cat.id}
              to={`/tip-details/${cat.id}`}
              className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? "bg-[#003466] text-white shadow-md scale-105"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.id}. {cat.title}
            </Link>
          );
        })}
      </div>

      {/* Tips List */}
      <div className="space-y-8">
        {currentCategory.tips.map((tip, idx) => {
          const tipKey = tip.id || `tip-${idx}`;
          const inlineQNum = activeInlineQuestions[tipKey];

          return (
            <article
              key={tipKey}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6"
            >
              {/* Tip Header matching daotaolaixebd style */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div
                  className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full text-white shadow-md border-4 border-emerald-100"
                  style={{ backgroundColor: "#149f83" }}
                >
                  <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#18a889] sm:text-2xl leading-snug">
                  Mẹo {idx + 1}: {tip.title || tip.text}
                </h2>
              </div>

              {/* Rules Table */}
              {tip.type === "table" && tip.rules ? (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#003466] text-white font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3.5 w-1/2">Từ khóa trên Câu Hỏi</th>
                        <th className="px-4 py-3.5 w-1/2">Từ khóa Đáp Án Đúng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {tip.rules.map((r, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}>
                          <td className="px-4 py-3 font-bold text-slate-900">{r.question}</td>
                          <td className="px-4 py-3 font-extrabold text-[#003466] bg-blue-50/30">{r.answer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {/* Description HTML content */}
              {tip.description ? (
                <div
                  className="prose max-w-none text-sm sm:text-base text-slate-800 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: tip.description }}
                />
              ) : null}

              {/* Sections */}
              {tip.sections ? (
                <div className="space-y-4">
                  {tip.sections.map((sec, secIdx) => (
                    <div key={secIdx}>
                      {sec.text ? (
                        <div
                          className="prose max-w-none text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200"
                          dangerouslySetInnerHTML={{ __html: sec.text }}
                        />
                      ) : null}

                      {sec.imageUrl ? (
                        <div className="my-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                          <img
                            src={sec.imageUrl}
                            alt="Minh họa mẹo"
                            className="max-h-80 rounded-xl object-contain mx-auto"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : null}

                      {/* Status grid icons */}
                      {sec.kind === "statusGrid" && sec.items ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 pt-2">
                          {sec.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center shadow-sm"
                            >
                              <img
                                src={`/uploads/${item.imageName}`}
                                alt={item.label}
                                className="h-16 w-16 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://daotaolaixebd.com/app/uploads/${item.imageName}`;
                                }}
                              />
                              <span className="mt-2 text-xs font-bold text-slate-800">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Example Questions Pointer Bar matching daotaolaixebd "☞ Xem câu" */}
              {tip.exampleQuestions && tip.exampleQuestions.length > 0 ? (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-red-600 font-extrabold text-base sm:text-xl leading-relaxed mr-1">
                      ☞ Xem câu
                    </span>
                    {tip.exampleQuestions.map((qNum, qIdx) => {
                      const isSelected = inlineQNum === qNum;
                      return (
                        <button
                          key={qNum}
                          type="button"
                          onClick={() => toggleInlineQuestion(tipKey, qNum)}
                          className={`text-base sm:text-xl font-extrabold transition text-red-600 hover:underline ${
                            isSelected ? "underline text-[#003466] bg-blue-50 px-1.5 py-0.5 rounded-lg" : ""
                          }`}
                        >
                          {qNum}
                          {qIdx < tip.exampleQuestions!.length - 1 ? "," : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* INLINE QUESTION VIEWER & EXPLANATION (renders right on the page!) */}
              {inlineQNum ? (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-200">
                  <InlineQuestionCard questionNumber={inlineQNum} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function InlineQuestionCard({ questionNumber }: { questionNumber: number }) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [result, setResult] = useState<PracticeAnswerResult | null>(null);

  const questionQuery = useQuery({
    queryKey: ["question-by-number", questionNumber],
    queryFn: () => getQuestionByNumber(questionNumber),
  });

  const submitMutation = useMutation({
    mutationFn: ({ questionId, answerId }: { questionId: number; answerId: number }) =>
      submitPracticeAnswer(questionId, answerId),
    onSuccess: (res) => {
      setResult(res);
    },
  });

  const handleSelectAnswer = (questionId: number, answerId: number) => {
    setSelectedAnswerId(answerId);
    submitMutation.mutate({ questionId, answerId });
  };

  if (questionQuery.isLoading) {
    return (
      <div className="p-6 text-center text-sm font-semibold text-slate-500 bg-slate-50 rounded-2xl animate-pulse">
        Đang tải dữ liệu Câu {questionNumber}...
      </div>
    );
  }

  if (questionQuery.isError || !questionQuery.data) {
    return (
      <div className="p-6 text-center text-sm text-red-600 font-semibold bg-red-50 rounded-2xl">
        Không tìm thấy dữ liệu cho Câu {questionNumber}.
      </div>
    );
  }

  const question = questionQuery.data;

  return (
    <div className="rounded-3xl border border-emerald-200 bg-[#f7fafd] p-5 sm:p-7 space-y-4 shadow-inner">
      {/* Question Title matching daotaolaixebd style */}
      <h3 className="text-base sm:text-xl font-black text-[#08745f] leading-snug">
        Câu {question.questionNumber}. {question.content}
      </h3>

      {/* Image if available */}
      {question.imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-center">
          <img
            src={question.imageUrl}
            alt={`Minh họa câu ${question.questionNumber}`}
            className="max-h-72 rounded-xl object-contain mx-auto"
          />
        </div>
      ) : null}

      {/* Option choices */}
      <div className="space-y-2.5">
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswerId === answer.id;
          const isCorrect = result?.correctAnswerIds.includes(answer.id) ?? false;
          const isWrong = result && isSelected && !isCorrect;

          let optionStyle = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
          if (isCorrect) {
            optionStyle = "border-[#18a889] bg-[#e8f5e9] text-emerald-950 font-bold shadow-sm";
          } else if (isWrong) {
            optionStyle = "border-[#ef1f2a] bg-[#ffebee] text-red-950 font-bold shadow-sm";
          } else if (isSelected) {
            optionStyle = "border-[#003466] bg-[#003466] text-white font-bold";
          }

          return (
            <button
              key={answer.id}
              type="button"
              onClick={() => handleSelectAnswer(question.id, answer.id)}
              disabled={submitMutation.isPending}
              className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left text-sm sm:text-base font-medium transition-all ${optionStyle}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black">
                {isCorrect ? (
                  <span className="text-emerald-700 text-base font-black">✓</span>
                ) : isWrong ? (
                  <span className="text-red-600 text-base font-black">✕</span>
                ) : (
                  <span className="text-slate-500 font-bold">{index + 1}.</span>
                )}
              </div>
              <span className="leading-relaxed">{answer.content}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Explanation Box ("Giải thích chi tiết") */}
      {result || question.explanation ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-[#003466] font-extrabold text-sm sm:text-base border-b border-slate-100 pb-2">
            <svg className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Giải thích chi tiết:</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium space-y-1.5 pt-1">
            {result?.explanation ? (
              <p className="text-slate-800 font-semibold">{result.explanation}</p>
            ) : question.explanation ? (
              <p className="text-slate-800 font-semibold">{question.explanation}</p>
            ) : null}

            {result?.correctAnswerIds ? (
              <p className="text-[#08745f] font-bold">
                ➜ Đáp án đúng: Đáp án {result.correctAnswerIds.map((id) => question.answers.find((a) => a.id === id)?.label || id).join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
