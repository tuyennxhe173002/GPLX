import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LICENSE_CONFIGS, ALL_LICENSE_LIST } from "../data/examRules";

export function ExamTestSelectorView() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLicenseCode = (searchParams.get("license") || "B").toUpperCase();
  const config = LICENSE_CONFIGS[activeLicenseCode] || LICENSE_CONFIGS.B;

  const [selectedExamId, setSelectedExamId] = useState<number | null>(1);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);

  const handleSelectLicense = (code: string) => {
    setSearchParams({ license: code });
    setSelectedExamId(1);
    setShowLicenseModal(false);
  };

  const handleStartExam = () => {
    if (!selectedExamId) return;
    navigate(`/exam/${config.code.toLowerCase()}/${selectedExamId}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001b3d] tracking-tight">
            Thi theo đề - {config.name}
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
            Chọn số đề muốn luyện, sau đó bắt đầu làm bài.
          </p>
        </div>

        {/* Change License Button */}
        <button
          type="button"
          onClick={() => setShowLicenseModal(true)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#003466] shadow-sm transition hover:bg-slate-50 hover:border-[#003466]"
        >
          Đổi hạng ({config.shortLabel})
        </button>
      </div>

      {/* Main Card */}
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          {/* Rules Banner */}
          <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div>
              <span className="font-extrabold text-[#003466]">{config.name}:</span>
              <span className="ml-1 text-slate-700 font-medium">{config.description}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-700 font-bold">
              <span className="bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs">
                📝 {config.totalQuestions} câu
              </span>
              <span className="bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs">
                ⏱️ {config.durationMinutes} phút
              </span>
              <span className="bg-white px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs text-emerald-700">
                🎯 Đạt: {config.minPassingScore}/{config.totalQuestions}
              </span>
            </div>
          </div>

          {/* Test Selection Grid */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-[#001b3d]">
              Chọn đề thi (Gồm {config.testCount} bộ đề)
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
              {Array.from({ length: config.testCount }, (_, i) => i + 1).map((testNum) => {
                const isSelected = selectedExamId === testNum;
                return (
                  <button
                    key={testNum}
                    type="button"
                    onClick={() => setSelectedExamId(testNum)}
                    className={`h-11 sm:h-12 w-full rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                      isSelected
                        ? "bg-[#fcab28] text-amber-950 border-2 border-[#003466] shadow-sm scale-105"
                        : "bg-white text-[#003466] border border-slate-200 hover:bg-blue-50/50 hover:border-[#003466]"
                    }`}
                  >
                    Đề {testNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              {selectedExamId
                ? `Đã chọn đề ${selectedExamId} cho ${config.name}.`
                : "Vui lòng chọn một đề thi để bắt đầu."}
            </p>

            <button
              type="button"
              disabled={!selectedExamId}
              onClick={handleStartExam}
              className="rounded-2xl bg-[#003466] px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-900/10 transition hover:bg-[#00254a] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              {selectedExamId ? `Bắt đầu đề ${selectedExamId}` : "Bắt đầu thi"}
            </button>
          </div>
        </div>
      </div>

      {/* License Selector Modal */}
      {showLicenseModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
              Chọn hạng GPLX thi thử
            </h3>

            <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {ALL_LICENSE_LIST.map((lc) => {
                const isActive = lc.code === config.code;
                return (
                  <button
                    key={lc.code}
                    type="button"
                    onClick={() => handleSelectLicense(lc.code)}
                    className={`rounded-2xl border p-3.5 text-left transition-all ${
                      isActive
                        ? "border-[#003466] bg-[#003466] text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-extrabold text-sm">{lc.name}</div>
                    <div className={`text-[11px] mt-1 line-clamp-2 ${isActive ? "text-slate-200" : "text-slate-500"}`}>
                      {lc.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowLicenseModal(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
