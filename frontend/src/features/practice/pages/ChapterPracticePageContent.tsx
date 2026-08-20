import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getChapters } from "../../chapters/api/chapterApi";
import { getQuestions } from "../../questions/api/questionApi";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PracticeSessionView } from "../components/PracticeSessionView";

export function ChapterPracticePageContent() {
  const params = useParams();
  const chapterId = Number(params.chapterId);

  const chaptersQuery = useQuery({ queryKey: ["chapters"], queryFn: getChapters });
  const questionsQuery = useQuery({
    queryKey: ["chapter-practice", chapterId],
    queryFn: () => getQuestions({ chapterId, page: 0, size: 100 }),
    enabled: Number.isFinite(chapterId),
  });

  const chapter = useMemo(() => chaptersQuery.data?.find((item) => item.id === chapterId), [chaptersQuery.data, chapterId]);

  if (chaptersQuery.isLoading || questionsQuery.isLoading) {
    return <LoadingState label="Dang tai bo cau hoi theo chuong..." />;
  }

  if (chaptersQuery.isError || questionsQuery.isError) {
    return <ErrorState message="Khong tai duoc du lieu luyen theo chuong." />;
  }

  return (
    <PracticeSessionView
      title={chapter ? `Chuong: ${chapter.name}` : "Luyen theo chuong"}
      description={chapter?.description ?? "Luyen tap tat ca cau hoi thuoc chuong da chon."}
      questions={questionsQuery.data?.content ?? []}
    />
  );
}
