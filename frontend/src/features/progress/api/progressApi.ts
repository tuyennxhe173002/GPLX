import { apiGet } from "../../../shared/api/apiClient";
import type { PracticeQuestion } from "../../questions/types/question";
import type { ChapterProgress, ProgressSummary } from "../types/progress";

export function getProgressSummary() {
  return apiGet<ProgressSummary>("/api/v1/me/progress");
}

export function getChapterProgress() {
  return apiGet<ChapterProgress[]>("/api/v1/me/progress/chapters");
}

export function getWrongQuestions() {
  return apiGet<PracticeQuestion[]>("/api/v1/me/wrong-questions");
}
