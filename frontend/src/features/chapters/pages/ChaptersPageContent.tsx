import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getChapters } from "../api/chapterApi";
import { getChapterProgress } from "../../progress/api/progressApi";
import { ChapterCard } from "../components/ChapterCard";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { SectionHeading } from "../../../shared/components/SectionHeading";
import { useAuthSession } from "../../../shared/auth/authSession";
import type { ChapterProgress } from "../../progress/types/progress";

export function ChaptersPageContent() {
  const { isAuthenticated } = useAuthSession();
  const chaptersQuery = useQuery({
    queryKey: ["chapters"],
    queryFn: getChapters,
  });
  const chapterProgressQuery = useQuery({
    queryKey: ["me", "progress", "chapters"],
    queryFn: getChapterProgress,
    enabled: isAuthenticated,
  });

  const progressByChapterId = useMemo(
    () => new Map<number, ChapterProgress>((chapterProgressQuery.data ?? []).map((progress: ChapterProgress) => [progress.chapterId, progress])),
    [chapterProgressQuery.data],
  );

  if (chaptersQuery.isLoading) {
    return <LoadingState label="Dang tai danh sach chuong..." />;
  }

  if (chaptersQuery.isError) {
    return <ErrorState message="Khong tai duoc danh sach chuong." />;
  }

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Phase 6"
        title="Luyen theo chuong"
        description="Chon tung chuong de hoc theo nhom noi dung, de di tu nen tang den cau sa hinh va tinh huong uu tien."
      />

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {chaptersQuery.data?.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} progress={progressByChapterId.get(chapter.id)} />)}
      </section>
    </div>
  );
}
