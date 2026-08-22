import { useNavigate } from "react-router-dom";
import { ALL_LICENSE_LIST, LICENSE_CONFIGS } from "../../exam/data/examRules";

export function RandomExamSetupView() {
  const navigate = useNavigate();

  const handleStartRandomExam = (licenseCode: string) => {
    const config = LICENSE_CONFIGS[licenseCode.toUpperCase()] || LICENSE_CONFIGS.B;
    const randomExamId = Math.floor(Math.random() * config.testCount) + 1;
    navigate(`/exam/${licenseCode.toLowerCase()}/${randomExamId}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#001b3d] tracking-tight">
          Thi ngẫu nhiên - Chọn hạng bằng
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
          Hệ thống sẽ tự động tạo một đề thi ngẫu nhiên theo đúng cấu trúc đề sát hạch chuẩn của Bộ GTVT.
        </p>
      </div>

      {/* Main License Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_LICENSE_LIST.map((lc) => (
          <button
            key={lc.code}
            type="button"
            onClick={() => handleStartRandomExam(lc.code)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#008765] hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#008765] shadow-inner group-hover:bg-[#008765] group-hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="rounded-full bg-[#edf9f5] px-3 py-1 text-xs font-bold text-[#17744c]">
                  Ngẫu nhiên
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-[#008765] transition-colors">
                {lc.name}
              </h2>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                {lc.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
                <span className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1">
                  📝 {lc.totalQuestions} câu
                </span>
                <span className="rounded-xl bg-slate-50 border border-slate-200 px-2.5 py-1">
                  ⏱️ {lc.durationMinutes} phút
                </span>
                <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-800">
                  🎯 Đạt: {lc.minPassingScore}/{lc.totalQuestions}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs sm:text-sm font-bold text-[#008765]">
              <span>Tạo đề &amp; Thi ngay</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
