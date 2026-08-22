const categories = [
  {
    id: 1,
    title: "MẸO PHẦN CHỮ",
    subtitle: "Quy tắc, khái niệm, các con số cần nhớ, tuổi & tốc độ",
    color: "#357f7a",
    gradient: "from-[#357f7a] to-[#20524f]",
    badgeBg: "bg-[#357f7a]",
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    count: "17 mẹo ghi nhớ"
  },
  {
    id: 2,
    title: "MẸO BIỂN BÁO CẤM",
    subtitle: "Quy tắc cấm xe từ nhỏ đến lớn, cấm kéo, cấm vượt",
    color: "#d90404",
    gradient: "from-[#d90404] to-[#960000]",
    badgeBg: "bg-[#d90404]",
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    count: "12 mẹo ghi nhớ"
  },
  {
    id: 3,
    title: "MẸO BIỂN BÁO NGUY HIỂM",
    subtitle: "Phân biệt đường đôi, dốc lên/xuống, gờ giảm tốc, cầu hẹp",
    color: "#d5a500",
    gradient: "from-[#d5a500] to-[#997600]",
    badgeBg: "bg-[#d5a500]",
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    count: "7 mẹo ghi nhớ"
  },
  {
    id: 4,
    title: "MẸO BIỂN CHỈ DẪN & HIỆU LỆNH",
    subtitle: "Làn đường xe khách, biển 50 tròn xanh, chữ zone, cầu vượt",
    color: "#257ba7",
    gradient: "from-[#257ba7] to-[#154e6b]",
    badgeBg: "bg-[#257ba7]",
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    count: "10 mẹo ghi nhớ"
  },
  {
    id: 5,
    title: "MẸO CÂU HỎI SA HÌNH",
    subtitle: "Quy tắc xe cảnh sát 1124, mũi tên nhiều hướng, xe đi trước",
    color: "#7830bd",
    gradient: "from-[#7830bd] to-[#4e1b80]",
    badgeBg: "bg-[#7830bd]",
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    count: "9 mẹo ghi nhớ"
  }
];

export function MnemonicsPage() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003466] via-[#004d99] to-[#00254a] p-8 text-white shadow-xl lg:p-10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-amber-300 backdrop-blur">
            <span>Bí Kíp Đỗ Ngay 100%</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Mẹo Ghi Nhớ 600 Câu Lý Thuyết GPLX
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Tổng hợp đầy đủ quy tắc rà từ khóa, bảng đối chiếu đáp án nhanh, mẹo biển báo cấm - nguy hiểm - chỉ dẫn và quy tắc giải sa hình siêu tốc.
          </p>
        </div>

        {/* Background glow */}
        <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl pointer-events-none"></div>
      </section>

      {/* Categories Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/tip-details/${cat.id}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-md group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Danh mục {cat.id}</span>
                <span className={`rounded-full ${cat.badgeBg} px-2.5 py-0.5 text-[11px] font-bold text-white`}>
                  {cat.count}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900 group-hover:text-[#003466]">
                {cat.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
                {cat.subtitle}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[#003466] group-hover:translate-x-1.5 transition-transform">
              <span>Xem chi tiết mẹo</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
