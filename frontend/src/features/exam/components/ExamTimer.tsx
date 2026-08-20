import { formatCountdown } from "../../../shared/utils/format";

export function ExamTimer({ remainingSeconds, profileCode }: { remainingSeconds: number; profileCode: string }) {
  const isUrgent = remainingSeconds <= 300;

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${isUrgent ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Thi thu {profileCode}</p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${isUrgent ? "text-red-700" : "text-slate-950"}`}>{formatCountdown(remainingSeconds)}</p>
      <p className="mt-2 text-sm text-slate-500">Dong ho nay chi de hien thi. Server moi la nguon su that cua bai thi.</p>
    </div>
  );
}
