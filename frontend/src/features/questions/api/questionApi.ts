import { apiGet } from "../../../shared/api/apiClient";
import type { PageResponse } from "../../../shared/types/pagination";
import type { PracticeQuestion } from "../types/question";

export function getQuestions(params: { chapterId?: number; page?: number; size?: number }) {
  return apiGet<PageResponse<PracticeQuestion>>("/api/v1/questions", params);
}

export function getQuestion(id: number) {
  return apiGet<PracticeQuestion>(`/api/v1/questions/${id}`);
}

export function getQuestionByNumber(questionNumber: number) {
  return apiGet<PracticeQuestion>(`/api/v1/questions/number/${questionNumber}`);
}

export function getRandomQuestions(size = 20) {
  return apiGet<PracticeQuestion[]>("/api/v1/questions/random", { size });
}

export function getCriticalQuestions() {
  return apiGet<PracticeQuestion[]>("/api/v1/questions/critical");
}
