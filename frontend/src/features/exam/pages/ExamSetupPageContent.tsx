import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getExamProfiles, createExam } from "../api/examApi";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { SectionHeading } from "../../../shared/components/SectionHeading";

export function ExamSetupPageContent() {
  const navigate = useNavigate();
  const profilesQuery = useQuery({ queryKey: ["exam-profiles"], queryFn: getExamProfiles });
  const createMutation = useMutation({
    mutationFn: createExam,
    onSuccess: (session) => {
      navigate(`/exam/${session.id}`);
    },
  });

  if (profilesQuery.isLoading) {
    return <LoadingState label="Dang tai danh sach hang thi..." />;
  }

  if (profilesQuery.isError) {
    return <ErrorState message="Khong tai duoc danh sach exam profiles." />;
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Phase 9"
        title="Thi thu theo hang GPLX"
        description="He thong tao de tren server theo exam profile, luu dap an tung cau va chi cham sau khi nop bai."
      />

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {profilesQuery.data?.map((profile) => (
          <article key={profile.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">{profile.profileCode}</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-950">{profile.displayName}</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{profile.questionCount} cau</span>
            </div>
            <dl className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4"><dt>Thoi gian</dt><dd>{profile.durationMinutes} phut</dd></div>
              <div className="flex items-center justify-between gap-4"><dt>Diem dat</dt><dd>{profile.passingScore}</dd></div>
              <div className="flex items-center justify-between gap-4"><dt>Critical</dt><dd>{profile.criticalQuestionCount}</dd></div>
            </dl>
            <button
              type="button"
              onClick={() => createMutation.mutate(profile.profileCode)}
              disabled={createMutation.isPending}
              className="mt-6 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {createMutation.isPending ? "Dang tao de..." : "Bat dau thi"}
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
