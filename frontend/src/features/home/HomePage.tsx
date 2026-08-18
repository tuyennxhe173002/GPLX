import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../../api/healthApi";

export function HomePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">GPLX 600 cau</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Nen tang luyen de ly thuyet GPLX</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Phase 1 da ket noi React frontend voi Spring Boot backend. Cac phase tiep theo se them database schema,
          import 600 cau hoi, luyen theo chuong va animation sa hinh.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-500">Backend health</p>
          {isLoading && <p className="mt-2 font-semibold text-slate-700">Dang kiem tra...</p>}
          {error && <p className="mt-2 font-semibold text-red-700">Khong ket noi duoc backend.</p>}
          {data && <p className="mt-2 font-semibold text-green-700">Status: {data.status}</p>}
        </div>
      </section>
    </main>
  );
}
