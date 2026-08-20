import { apiGet } from "../../../shared/api/apiClient";
import type { Chapter } from "../types/chapter";

export function getChapters() {
  return apiGet<Chapter[]>("/api/v1/chapters");
}
