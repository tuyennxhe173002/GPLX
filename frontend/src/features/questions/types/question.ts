export type Answer = {
  id: number;
  label: string;
  content: string;
  sortOrder: number;
};

export type PracticeQuestion = {
  id: number;
  questionNumber: number;
  chapterId: number;
  chapterCode: string;
  content: string;
  imageUrl: string | null;
  questionType: "TEXT" | "IMAGE" | "TRAFFIC_SCENE" | "SIGN";
  isCritical: boolean;
  explanation?: string | null;
  answers: Answer[];
};
