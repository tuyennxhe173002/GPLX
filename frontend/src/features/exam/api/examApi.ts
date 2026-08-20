import { apiGet, apiPost, apiPut } from "../../../shared/api/apiClient";
import type { ExamProfile, ExamResult, ExamSession, SaveExamAnswerResponse } from "../types/exam";

export function getExamProfiles() {
  return apiGet<ExamProfile[]>("/api/v1/exam-profiles");
}

export function createExam(profileCode: string) {
  return apiPost<ExamSession, { profileCode: string }>("/api/v1/exams", { profileCode });
}

export function getExam(examId: number) {
  return apiGet<ExamSession>(`/api/v1/exams/${examId}`);
}

export function saveExamAnswer(examId: number, questionId: number, answerId: number) {
  return apiPut<SaveExamAnswerResponse, { answerId: number }>(`/api/v1/exams/${examId}/answers/${questionId}`, { answerId });
}

export function submitExam(examId: number) {
  return apiPost<ExamResult, Record<string, never>>(`/api/v1/exams/${examId}/submit`, {});
}

export function getExamResult(examId: number) {
  return apiGet<ExamResult>(`/api/v1/exams/${examId}/result`);
}
