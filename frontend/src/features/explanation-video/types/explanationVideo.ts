export type ExplanationVideo = {
  id: number;
  questionId: number;
  questionNumber: number;
  provider: string;
  sourceUrl: string;
  externalFileId: string;
  embedUrl: string;
  title: string | null;
  isActive: boolean;
};

export type ExplanationVideoRequest = {
  driveUrl: string;
  title?: string;
  isActive?: boolean;
};

export type VideoPreviewRequest = {
  driveUrl: string;
};

export type VideoPreviewResponse = {
  externalFileId: string;
  embedUrl: string;
  provider: string;
};
