import type { Answer } from "../../questions/types/question";

export type ProgressSummary = {
  totalQuestions: number;
  attemptedQuestions: number;
  correctAttempts: number;
  wrongAttempts: number;
  masteryScore: number;
};

export type ChapterProgress = {
  chapterId: number;
  chapterCode: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAttempts: number;
  wrongAttempts: number;
};

export type WrongQuestionItem = {
  questionId: number;
  questionNumber: number;
  content: string;
  imageUrl: string | null;
  questionType: "TEXT" | "IMAGE" | "TRAFFIC_SCENE" | "SIGN";
  isCritical: boolean;
  hasAnimation: boolean;
  chapterId: number;
  chapterCode: string;
  wrongCount: number;
  correctCount: number;
  totalAttempts: number;
  lastCorrect: boolean | null;
  lastAnsweredAt: string;
  answers: Answer[];
};

export type PracticeHistoryItem = {
  id: number;
  questionId: number;
  questionNumber: number;
  questionContent: string;
  selectedAnswerId: number;
  selectedAnswerContent: string;
  isCorrect: boolean;
  createdAt: string;
};

export type ExamHistoryItem = {
  sessionId: number;
  licenseType: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  criticalWrongCount: number;
  passed: boolean;
  state: string;
  startedAt: string;
  finishedAt: string | null;
};

export type UserHistoryResponse = {
  recentPracticeAttempts: PracticeHistoryItem[];
  recentExamSessions: ExamHistoryItem[];
};
