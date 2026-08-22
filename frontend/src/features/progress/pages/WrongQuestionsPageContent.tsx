import { useQuery } from "@tanstack/react-query";
import { PracticeSessionView } from "../../practice/components/PracticeSessionView";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { useAuthSession } from "../../../shared/auth/authSession";
import { getWrongQuestions } from "../api/progressApi";

export function WrongQuestionsPageContent() {
  const { isAuthenticated } = useAuthSession();
  const wrongQuestionsQuery = useQuery({
    queryKey: ["me", "wrong-questions"],
    queryFn: getWrongQuestions,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <EmptyState title="Can dang nhap" description="Dang nhap de xem va on lai nhung cau hoi da tra loi sai." />;
  }

  if (wrongQuestionsQuery.isLoading) {
    return <LoadingState label="Dang tai danh sach cau sai..." />;
  }

  if (wrongQuestionsQuery.isError) {
    return <ErrorState message="Khong tai duoc danh sach cau sai." />;
  }

  return (
    <PracticeSessionView
      title="On lai cau da tra loi sai"
      description="Lay du lieu tu backend `/api/v1/me/wrong-questions` de tap trung sua nhom cau ban dang yeu nhat."
      questions={wrongQuestionsQuery.data ?? []}
    />
  );
}
