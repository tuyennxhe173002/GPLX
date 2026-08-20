import { useQuery } from "@tanstack/react-query";
import { getCriticalQuestions } from "../../questions/api/questionApi";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { PracticeSessionView } from "../components/PracticeSessionView";

export function CriticalPracticePageContent() {
  const questionsQuery = useQuery({
    queryKey: ["practice-critical"],
    queryFn: getCriticalQuestions,
  });

  if (questionsQuery.isLoading) {
    return <LoadingState label="Dang tai bo cau diem liet..." />;
  }

  if (questionsQuery.isError) {
    return <ErrorState message="Khong tai duoc bo cau diem liet." />;
  }

  return (
    <PracticeSessionView
      title="On cau diem liet"
      description="Tap trung vao nhom cau neu tra loi sai se anh huong truc tiep den ket qua sat hach."
      questions={questionsQuery.data ?? []}
    />
  );
}
