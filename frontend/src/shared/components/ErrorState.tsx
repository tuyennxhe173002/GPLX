type ErrorStateProps = {
  title?: string;
  message: string;
};

export function ErrorState({ title = "Co loi xay ra", message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-red-800">{message}</p>
    </div>
  );
}
