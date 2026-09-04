import { apiDelete, apiGet, apiPost, apiPut } from "../../../shared/api/apiClient";
import type {
  ExplanationVideo,
  ExplanationVideoRequest,
  VideoPreviewRequest,
  VideoPreviewResponse,
} from "../types/explanationVideo";

export function getExplanationVideo(questionId: number) {
  return apiGet<ExplanationVideo | null>(`/api/v1/questions/${questionId}/explanation-video`, {
    auth: false,
  });
}

export function createExplanationVideo(questionId: number, request: ExplanationVideoRequest) {
  return apiPost<ExplanationVideo, ExplanationVideoRequest>(
    `/api/v1/questions/${questionId}/explanation-video`,
    request,
    { auth: true }
  );
}

export function updateExplanationVideo(questionId: number, request: ExplanationVideoRequest) {
  return apiPut<ExplanationVideo, ExplanationVideoRequest>(
    `/api/v1/questions/${questionId}/explanation-video`,
    request,
    { auth: true }
  );
}

export function deleteExplanationVideo(questionId: number) {
  return apiDelete(`/api/v1/questions/${questionId}/explanation-video`, {
    auth: true,
  });
}

export function previewExplanationVideo(request: VideoPreviewRequest) {
  return apiPost<VideoPreviewResponse, VideoPreviewRequest>(
    "/api/v1/explanation-videos/preview",
    request,
    { auth: false }
  );
}

export function getAllExplanationVideos() {
  return apiGet<ExplanationVideo[]>("/api/v1/explanation-videos", {
    auth: true,
  });
}
