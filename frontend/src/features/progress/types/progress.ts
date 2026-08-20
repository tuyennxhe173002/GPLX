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
