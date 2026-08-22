import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

type LayoutContext = {
  selectedLicense?: string;
};

const licenseClasses = [
  { code: "B", label: "Hạng B", desc: "Ô tô chở người đến 9 chỗ, tải dưới 3.500kg" },
  { code: "C1", label: "Hạng C1", desc: "Ô tô tải 3.500kg đến 7.500kg" },
  { code: "C", label: "Hạng C", desc: "Ô tô tải trên 7.500kg" },
  { code: "D1", label: "Hạng D1", desc: "Ô tô chở người 10 đến 16 chỗ" },
  { code: "D2", label: "Hạng D2", desc: "Ô tô chở người 17 đến 30 chỗ" },
  { code: "D", label: "Hạng D", desc: "Ô tô chở người trên 30 chỗ" },
  { code: "CE", label: "Hạng CE", desc: "Ô tô đầu kéo kéo rơ moóc" },
  { code: "DE", label: "Hạng DE", desc: "Xe khách nối toa" },
  { code: "A1", label: "Hạng A1", desc: "Mô tô 2 bánh dung tích đến 125cc" },
  { code: "A", label: "Hạng A", desc: "Mô tô 2 bánh dung tích trên 125cc" },
];

export function TheoryPage() {
  const context = useOutletContext<LayoutContext>();
  const [activeLicense, setActiveLicense] = useState<string>(context?.selectedLicense || "B");

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003466] via-[#004d99] to-[#00254a] p-8 text-white shadow-xl lg:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-300 backdrop-blur">
            <span>Chương Trình Đào Tạo GPLX Mới Nhất</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
            Ôn Luyện Lý Thuyết 600 Câu Hỏi GPLX
          </h1>
          <p className="text-base text-slate-200 sm:text-lg">
            Học để hiểu, nhớ nhanh, đỗ ngay lần đầu. Đầy đủ 600 câu hỏi chuẩn Bộ GTVT & CSGT, bao gồm 60 câu điểm liệt, mẹo thi nhanh và giải thích chi tiết.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              to="/theory/theo-chuong"
              className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 hover:scale-105 active:scale-95"
            >
              Vào Ôn 600 Câu Ngay
            </Link>
            <Link
              to="/exam"
              className="inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-6 py-3.5 text-base font-bold text-white backdrop-blur transition hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Thi Thử Đề Chuẩn Hạng {activeLicense}
            </Link>
          </div>
        </div>

        {/* Decorative Blur Circles */}
        <div className="absolute -right-12 -top-12 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-20 h-80 w-80 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>
      </section>

      {/* License Selector Pills */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#003466]">Chọn hạng GPLX ôn luyện:</h2>
          <span className="text-xs font-semibold text-slate-500">Đang chọn: Hạng {activeLicense}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {licenseClasses.map((lc) => {
            const isActive = activeLicense === lc.code;
            return (
              <button
                key={lc.code}
                type="button"
                onClick={() => setActiveLicense(lc.code)}
                className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm ${isActive
                    ? "bg-[#003466] text-white ring-2 ring-[#003466] ring-offset-2 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-[#003466] border border-slate-200"
                  }`}
              >
                {lc.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Consolidated Feature Cards Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Tính năng ôn luyện &amp; thi thử</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: 600 câu lý thuyết */}
          <Link
            to="/theory/theo-chuong"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#003466] hover:shadow-md"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#003466] shadow-inner group-hover:bg-[#003466] group-hover:text-white transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#003466] group-hover:text-blue-700">600 câu lý thuyết</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Luyện toàn bộ 600 câu hỏi GPLX chính thức. Có hiển thị kết quả đúng sai và lời giải chi tiết tức thì.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#003466] group-hover:translate-x-1 transition-transform">
              <span>Bắt đầu ôn luyện</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 2: Ôn theo chương */}
          <Link
            to="/theory/theo-chuong"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#003466] hover:shadow-md"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#003466] group-hover:text-indigo-700">Ôn theo chương</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Phân chia rõ ràng từ Chương 1 đến Chương 6: Khái niệm & Quy tắc, Đạo đức, Kỹ thuật lái, Cấu tạo sửa chữa, Biển báo & Sa hình.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#003466] group-hover:translate-x-1 transition-transform">
              <span>Học theo chương</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 3: 60 Câu điểm liệt */}
          <Link
            to="/theory/cau-diem-liet"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-red-300 bg-red-50/40 p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-red-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md group-hover:bg-red-700 transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <h3 className="text-xl font-bold text-red-950 group-hover:text-red-700">60 câu điểm liệt</h3>
                <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">Bắt buộc</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-red-900/80">
                Tổng hợp 60 câu tình huống mất an toàn giao thông nghiêm trọng. Trả lời sai 1 câu trong bài thi sát hạch là TRƯỢT NGAY.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>Luyện 60 câu điểm liệt</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 4: Mẹo thi 600 câu */}
          <Link
            to="/mnemonics"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-500 hover:shadow-md"
          >
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#003466] group-hover:text-amber-600">Mẹo thi 600 câu</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                55 mẹo ghi nhớ nhanh lý thuyết, biển báo, sa hình, tốc độ, độ tuổi, khoảng cách an toàn giúp làm bài thi cực nhanh.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#003466] group-hover:translate-x-1 transition-transform">
              <span>Xem mẹo thi</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 5: Thi theo đề */}
          <Link
            to="/exam"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#003466] hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0f7] text-[#003466] shadow-inner group-hover:bg-[#003466] group-hover:text-white transition-colors">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#003466]">
                  Theo đề
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#003466] group-hover:text-blue-700">Thi theo đề</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Chọn hạng bằng và số đề cụ thể để luyện lại.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-[#003466]">
              <span className="text-xs text-slate-500 font-medium">Theo bộ đề</span>
              <div className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Chọn đề thi</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Card 6: Thi ngẫu nhiên */}
          <Link
            to="/practice/random"
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#008765] hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e3f4ef] text-[#008765] shadow-inner group-hover:bg-[#008765] group-hover:text-white transition-colors">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="rounded-full bg-[#edf9f5] px-3 py-1 text-xs font-bold text-[#17744c]">
                  Ngẫu nhiên
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-[#008765] transition-colors">Thi ngẫu nhiên</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Mở đề thi thử đúng hạng bằng bạn chọn.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-[#008765]">
              <span className="text-xs text-slate-500 font-medium">Thi thử đúng hạng</span>
              <div className="flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                <span>Chọn hạng</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Quick Review Row: Bookmark & Wrong Questions */}
      <section className="grid gap-6 sm:grid-cols-2">
        <Link
          to="/bookmarks"
          className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Câu hỏi đã đánh dấu</h4>
            <p className="text-xs sm:text-sm text-slate-600">Xem lại các câu hỏi bạn đã đánh dấu để ôn tập kỹ hơn</p>
          </div>
        </Link>

        <Link
          to="/wrong-questions"
          className="flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-md"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Các câu làm sai</h4>
            <p className="text-xs sm:text-sm text-slate-600">Luyện tập lại các câu hỏi bạn đã từng trả lời sai</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
