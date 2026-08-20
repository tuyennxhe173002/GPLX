export function LoadingState({ label = "Dang tai..." }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-600 shadow-sm">
      {label}
    </div>
  );
}
