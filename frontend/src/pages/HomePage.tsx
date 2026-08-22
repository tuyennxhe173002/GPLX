import { Link } from "react-router-dom";

type HomeActionCardProps = {
  to: string;
  title: string;
  description: string;
  accent: "blue" | "amber" | "green";
  icon: React.ReactNode;
};

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="25" stroke="#3FA6E0" strokeWidth="3" />
      <path d="M32 18C28 21 24 22 20 22V38C24 38 28 39 32 42C36 39 40 38 44 38V22C40 22 36 21 32 18Z" fill="#DBF2FD" stroke="#3FA6E0" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 18V42" stroke="#3FA6E0" strokeWidth="2" />
      <path d="M26 15H38" stroke="#E37B3C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="11.5" r="3" fill="#46B35F" />
    </svg>
  );
}

function LotusIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="25" stroke="#3FA6E0" strokeWidth="3" />
      <path d="M32 19C35 22 36.5 26 36.5 30C36.5 34 35 38 32 42C29 38 27.5 34 27.5 30C27.5 26 29 22 32 19Z" fill="#DBF2FD" stroke="#3FA6E0" strokeWidth="2" />
      <path d="M22 29C26 29 29 31.5 32 36C28 37 24.5 37 20 35C20 32.5 20.5 31 22 29Z" fill="#DBF2FD" stroke="#3FA6E0" strokeWidth="2" />
      <path d="M42 29C38 29 35 31.5 32 36C36 37 39.5 37 44 35C44 32.5 43.5 31 42 29Z" fill="#DBF2FD" stroke="#3FA6E0" strokeWidth="2" />
      <path d="M21 45H43" stroke="#3FA6E0" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 12V18" stroke="#E37B3C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="10" r="3" fill="#46B35F" />
    </svg>
  );
}

function ScenarioIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="15" y="10" width="34" height="44" rx="4" fill="#2C8B58" />
      <rect x="23" y="22" width="18" height="4" rx="2" fill="white" />
      <rect x="23" y="31" width="18" height="4" rx="2" fill="white" />
      <rect x="23" y="40" width="12" height="4" rx="2" fill="white" />
      <circle cx="52" cy="18" r="5" fill="#CBE9D7" />
      <circle cx="15" cy="50" r="4" fill="#DDF3E6" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke="#EA4335" strokeWidth="2" strokeOpacity="0.25" />
      <circle cx="32" cy="32" r="15" stroke="#EA4335" strokeOpacity="0.2" />
      <rect x="20" y="25" width="18" height="14" rx="2" stroke="#D63434" strokeWidth="2.5" />
      <path d="M40 29L47 25V39L40 35V29Z" fill="#D63434" />
    </svg>
  );
}

function HomeActionCard({ to, title, description, accent, icon }: HomeActionCardProps) {
  const styles = {
    blue: {
      border: "border-[#2d5f96]",
      title: "text-[#083f79]",
      iconShell: "border-[#dce8f7] bg-[#f8fbff]",
      arrowShell: "bg-[#f1f6ff] text-[#0b4d8e]",
      glow: "from-white via-[#f6f9ff] to-[#ecf4ff]",
    },
    amber: {
      border: "border-[#e2d4b6]",
      title: "text-[#9b6900]",
      iconShell: "border-[#f2e6c7] bg-[#fffaf0]",
      arrowShell: "bg-[#fff6dd] text-[#b17700]",
      glow: "from-white via-[#fffaf0] to-[#fff2cf]",
    },
    green: {
      border: "border-[#cedfd6]",
      title: "text-[#17744c]",
      iconShell: "border-[#dceee5] bg-[#f6fcf8]",
      arrowShell: "bg-[#eef8f0] text-[#17744c]",
      glow: "from-white via-[#f7fbf9] to-[#eaf7ef]",
    },
  }[accent];

  return (
    <Link
      to={to}
      className={`group relative overflow-hidden rounded-[22px] border bg-gradient-to-r ${styles.glow} ${styles.border} px-5 py-9 shadow-[0_12px_30px_rgba(70,96,140,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(70,96,140,0.12)] sm:px-6`}
    >
      <div className="flex items-center gap-5 pr-16 sm:pr-24">
        <div className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[18px] border shadow-sm ${styles.iconShell}`}>
          {icon}
        </div>

        <div>
          <h2 className={`text-[28px] font-bold tracking-[-0.02em] ${styles.title}`}>{title}</h2>
          <p className="mt-2 text-[18px] text-slate-700">{description}</p>
        </div>
      </div>

      <div className={`absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full ${styles.arrowShell} transition group-hover:translate-x-1`}>
        <ArrowIcon className="h-6 w-6" />
      </div>
    </Link>
  );
}

export function HomePage() {
  return (
    <div className="mx-auto max-w-[1280px]">
      <section className="px-2 sm:px-4 lg:px-0">
        <h1 className="text-[38px] font-bold tracking-[-0.03em] text-[#083f79] sm:text-[52px]">Ôn tập và thi thử</h1>

        <div className="mt-10 space-y-4 sm:space-y-5">
          <HomeActionCard
            to="/chapters"
            title="600 câu lý thuyết"
            description="Ôn tập và thi thử bộ câu hỏi chính thức"
            accent="blue"
            icon={<BookIcon />}
          />

          <HomeActionCard
            to="/exam"
            title="120 câu mô phỏng"
            description="Ôn thi tốt nghiệp"
            accent="amber"
            icon={<LotusIcon />}
          />

          <HomeActionCard
            to="/practice/critical"
            title="120 Tình huống mô phỏng"
            description="Ôn thi tốt nghiệp"
            accent="green"
            icon={<ScenarioIcon />}
          />

          <div className="overflow-hidden rounded-[22px] border border-[#f2b8b5] bg-white shadow-[0_12px_30px_rgba(217,48,37,0.08)]">
            <div className="flex items-center justify-between gap-5 px-5 py-8 sm:px-6">
              <div className="flex items-center gap-5">
                <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full border border-[#f6c4c0] bg-white shadow-sm">
                  <LiveIcon />
                </div>

                <div>
                  <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[#083f79]">Kênh và giờ live</h2>
                  <p className="mt-2 text-[18px] text-slate-700">Có giáo viên đang live, bấm để xem ngay</p>
                </div>
              </div>

              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 whitespace-nowrap text-[18px] font-semibold text-[#e53b33] transition hover:translate-x-0.5">
                <span>Xem lịch</span>
                <ArrowIcon className="h-6 w-6" />
              </a>
            </div>
            <div className="h-1.5 bg-[#e53b33]" />
          </div>
        </div>
      </section>
    </div>
  );
}
