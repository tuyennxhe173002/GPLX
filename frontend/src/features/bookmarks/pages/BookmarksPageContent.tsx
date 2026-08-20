import { useQuery } from "@tanstack/react-query";
import { getBookmarks } from "../api/bookmarkApi";
import { PracticeSessionView } from "../../practice/components/PracticeSessionView";
import { EmptyState } from "../../../shared/components/EmptyState";
import { ErrorState } from "../../../shared/components/ErrorState";
import { LoadingState } from "../../../shared/components/LoadingState";
import { useAuthSession } from "../../../shared/auth/authSession";

export function BookmarksPageContent() {
  const { isAuthenticated } = useAuthSession();
  const bookmarksQuery = useQuery({
    queryKey: ["me", "bookmarks"],
    queryFn: getBookmarks,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <EmptyState title="Can dang nhap" description="Dang nhap de xem danh sach cau hoi da bookmark cua ban." />;
  }

  if (bookmarksQuery.isLoading) {
    return <LoadingState label="Dang tai danh sach bookmark..." />;
  }

  if (bookmarksQuery.isError) {
    return <ErrorState message="Khong tai duoc bookmark." />;
  }

  return (
    <PracticeSessionView
      title="Cau hoi da danh dau"
      description="Tap trung vao nhung cau can xem lai nhanh, giu dong hoc lien mach voi bookmark theo user."
      questions={bookmarksQuery.data ?? []}
    />
  );
}
