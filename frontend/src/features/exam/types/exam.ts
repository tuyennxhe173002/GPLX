import type { Answer } from "../../questions/types/question";

export type ExamProfile = {
  id: number;
  profileCode: string;
  displayName: string;
  questionCount: number;
  durationMinutes: number;
  passingScore: number;
  criticalFailEnabled: boolean;
  criticalQuestionCount: number;
};

export type ExamQuestion = {
  id: number;
  questionNumber: number;
  content: string;
  imageUrl: string | null;
  questionType: "TEXT" | "IMAGE" | "TRAFFIC_SCENE" | "SIGN";
  isCritical: boolean;
  selectedAnswerId: number | null;
  answers: Answer[];
};

export type ExamSession = {
  id: number;
  profileCode: string;
  profileName: string;
  state: "CREATED" | "IN_PROGRESS" | "SUBMITTED" | "EXPIRED";
  startedAt: string;
  expiresAt: string;
  questions: ExamQuestion[];
};

export type SaveExamAnswerResponse = {
  saved: boolean;
};

export type ExamResultQuestion = {
  questionId: number;
  questionNumber: number;
  selectedAnswerId: number | null;
  correctAnswerIds: number[];
  correct: boolean;
  explanation: string;
};

export type ExamResult = {
  examId: number;
  profileCode: string;
  state: "SUBMITTED" | "EXPIRED";
  score: number;
  passed: boolean;
  criticalWrongCount: number;
  questions: ExamResultQuestion[];
};
