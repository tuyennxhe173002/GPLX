import { apiGet } from "../../../shared/api/apiClient";
import type { ChapterProgress, ProgressSummary, UserHistoryResponse, WrongQuestionItem } from "../types/progress";

export function getProgressSummary() {
  return apiGet<ProgressSummary>("/api/v1/me/progress", { auth: true });
}

export function getChapterProgress() {
  return apiGet<ChapterProgress[]>("/api/v1/me/progress/chapters", { auth: true });
}

export function getWrongQuestions() {
  return apiGet<WrongQuestionItem[]>("/api/v1/me/wrong-questions", { auth: true });
}

export function getUserHistory() {
  return apiGet<UserHistoryResponse>("/api/v1/me/history", { auth: true });
}
