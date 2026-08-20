import { useQuery } from "@tanstack/react-query";
import { getRandomQuestions } from "../../questions/api/questionApi";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PracticeSessionView } from "../components/PracticeSessionView";

export function RandomPracticePageContent() {
  const questionsQuery = useQuery({
    queryKey: ["practice-random"],
    queryFn: () => getRandomQuestions(20),
  });

  if (questionsQuery.isLoading) {
    return <LoadingState label="Dang lay bo de ngau nhien..." />;
  }

  if (questionsQuery.isError) {
    return <ErrorState message="Khong tai duoc bo cau hoi ngau nhien." />;
  }

  return (
    <PracticeSessionView
      title="Luyen ngau nhien"
      description="Bo cau ngau nhien phu hop de tap quen toc do va chuyen ngu canh nhanh truoc khi thi thu."
      questions={questionsQuery.data ?? []}
    />
  );
}
