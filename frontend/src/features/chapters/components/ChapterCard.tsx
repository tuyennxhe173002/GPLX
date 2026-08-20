import { Link } from "react-router-dom";
import type { Chapter } from "../types/chapter";
import type { ChapterProgress } from "../../progress/types/progress";

export function ChapterCard({ chapter, progress }: { chapter: Chapter; progress?: ChapterProgress }) {
  const attemptedPercent = progress && progress.totalQuestions > 0 ? Math.round((progress.attemptedQuestions / progress.totalQuestions) * 100) : 0;

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{chapter.code}</p>
          <h2 className="mt-3 text-xl font-semibold text-slate-950">{chapter.name}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">#{chapter.sortOrder}</span>
      </div>
      <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600">{chapter.description ?? "Chuong luyen tap khong co mo ta them."}</p>

      {progress ? (
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Tien do</span>
            <span>{attemptedPercent}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-slate-950" style={{ width: `${attemptedPercent}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Da lam</p>
              <p className="mt-1 font-semibold text-slate-950">{progress.attemptedQuestions}/{progress.totalQuestions}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Dung</p>
              <p className="mt-1 font-semibold text-emerald-700">{progress.correctAttempts}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Sai</p>
              <p className="mt-1 font-semibold text-rose-700">{progress.wrongAttempts}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex gap-3">
        <Link
          to={`/chapters/${chapter.id}/practice`}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Luyen theo chuong
        </Link>
      </div>
    </article>
  );
}
