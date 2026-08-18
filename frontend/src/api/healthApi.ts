import { apiGet } from "./http";

export type HealthResponse = {
  status: string;
};

export function getHealth() {
  return apiGet<HealthResponse>("/api/health");
}
