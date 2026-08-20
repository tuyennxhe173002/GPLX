import { apiGet, apiPost } from "../../../shared/api/apiClient";
import type { PracticeAnswerResult } from "../types/practice";

export type AnimationResponse = {
  id: number;
  questionId: number;
  sceneWidth: number;
  sceneHeight: number;
  backgroundImageUrl: string | null;
  durationMs: number;
  animationData: Record<string, unknown>;
};

export function submitPracticeAnswer(questionId: number, answerId: number) {
  return apiPost<PracticeAnswerResult, { questionId: number; answerId: number }>("/api/v1/practice/answers", {
    questionId,
    answerId,
  });
}

export function getPracticeAttemptAnimation(attemptId: number) {
  return apiGet<AnimationResponse>(`/api/v1/practice/attempts/${attemptId}/animation`);
}
