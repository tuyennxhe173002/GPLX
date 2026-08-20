import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBookmarks } from "../features/bookmarks/api/bookmarkApi";
import { getProgressSummary } from "../features/progress/api/progressApi";
import type { PracticeQuestion } from "../features/questions/types/question";
import { getHealth } from "../features/system/api/healthApi";
import { SectionHeading } from "../shared/components/SectionHeading";
import { useAuthSession } from "../shared/auth/authSession";

const quickActions = [
  {
    to: "/chapters",
    title: "Luyen theo chuong",
    description: "Di tu nhom khai niem, bien bao den sa hinh mot cach co cau truc.",
  },
  {
    to: "/practice/random",
    title: "Luyen ngau nhien",
    description: "Tao bo cau hop voi nhịp luyen nhanh va chuyen ngu canh lien tuc.",
  },
  {
    to: "/exam",
    title: "Thi thu",
    description: "Tao de tren server, luu dap an tung cau va cham bai sau khi nop.",
  },
];

export function HomePage() {
  const { session, isAuthenticated } = useAuthSession();
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });
  const progressSummaryQuery = useQuery({
    queryKey: ["me", "progress"],
    queryFn: getProgressSummary,
    enabled: isAuthenticated,
  });
  const bookmarksQuery = useQuery({
    queryKey: ["me", "bookmarks"],
    queryFn: getBookmarks,
    enabled: isAuthenticated,
  });

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-xl sm:p-10">
        <SectionHeading
          eyebrow="GPLX 2025"
          title={isAuthenticated && session ? `Chao mung tro lai, ${session.user.fullName}` : "Nen tang luyen 600 cau ly thuyet va thi thu theo dung contract"}
          description={
            isAuthenticated
              ? "Tien do, bookmark va ket qua luyen tap da duoc gan voi tai khoan hien tai."
              : "Practice va Exam da tach ro boundary: question read API khong lo dap an, exam tao de tren server, va explanation chi xuat hien dung thoi diem."
          }
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/chapters" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Bat dau luyen theo chuong
          </Link>
          <Link to="/exam" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
            Vao thi thu
          </Link>
          {!isAuthenticated ? (
            <Link to="/auth" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Dang nhap de luu tien do
            </Link>
          ) : null}
        </div>
      </section>

      {isAuthenticated && progressSummaryQuery.data ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Tong cau hoi", progressSummaryQuery.data.totalQuestions],
            ["Da thu", progressSummaryQuery.data.attemptedQuestions],
            ["Luot dung", progressSummaryQuery.data.correctAttempts],
            ["Bookmark", bookmarksQuery.data?.length ?? 0],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
            </article>
          ))}
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <h2 className="text-xl font-semibold text-slate-950">{action.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
          </Link>
        ))}
      </section>

      {isAuthenticated ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Bookmark gan day</h2>
              <p className="mt-2 text-sm text-slate-600">Mo lai nhanh cac cau da danh dau tu backend `/api/v1/me/bookmarks`.</p>
            </div>
            <Link to="/bookmarks" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Xem tat ca
            </Link>
          </div>

          {bookmarksQuery.data && bookmarksQuery.data.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookmarksQuery.data.slice(0, 3).map((question: PracticeQuestion) => (
                <article key={question.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{question.chapterCode}</p>
                  <h3 className="mt-2 text-base font-semibold text-slate-950">Cau {question.questionNumber}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{question.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-600">Ban chua co bookmark nao.</p>
          )}
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Backend health</h2>
        {healthQuery.isLoading ? <p className="mt-3 text-sm text-slate-600">Dang kiem tra backend...</p> : null}
        {healthQuery.isError ? <p className="mt-3 text-sm text-red-700">Khong ket noi duoc backend.</p> : null}
        {healthQuery.data ? <p className="mt-3 text-sm font-medium text-emerald-700">Status: {healthQuery.data.status}</p> : null}
      </section>
    </div>
  );
}
