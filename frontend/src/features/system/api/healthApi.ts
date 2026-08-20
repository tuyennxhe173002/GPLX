import { apiGet } from "../../../shared/api/apiClient";

export type HealthResponse = {
  status: string;
};

export function getHealth() {
  return apiGet<HealthResponse>("/api/health");
}
