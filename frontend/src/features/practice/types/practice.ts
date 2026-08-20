import type { PracticeQuestion } from "../../questions/types/question";

export type PracticeAnswerAnimation = {
  available: boolean;
  attemptId: number;
  animationId: number | null;
};

export type PracticeAnswerResult = {
  questionId: number;
  selectedAnswerId: number;
  correct: boolean;
  correctAnswerIds: number[];
  explanation: string;
  animation: PracticeAnswerAnimation;
};

export type PracticeMode = "chapter" | "random" | "critical";

export type PracticeSessionData = {
  mode: PracticeMode;
  title: string;
  description: string;
  questions: PracticeQuestion[];
};
