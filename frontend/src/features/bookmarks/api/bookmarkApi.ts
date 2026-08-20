import { apiDelete, apiGet, apiPost } from "../../../shared/api/apiClient";
import type { PracticeQuestion } from "../../questions/types/question";

export function getBookmarks() {
  return apiGet<PracticeQuestion[]>("/api/v1/me/bookmarks");
}

export function addBookmark(questionId: number) {
  return apiPost<void, Record<string, never>>(`/api/v1/me/bookmarks/${questionId}`, {});
}

export function removeBookmark(questionId: number) {
  return apiDelete(`/api/v1/me/bookmarks/${questionId}`);
}
