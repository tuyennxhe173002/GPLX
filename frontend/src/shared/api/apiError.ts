export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ErrorResponse = {
  message?: string;
  code?: string;
};

export async function toApiError(response: Response): Promise<ApiError> {
  let payload: ErrorResponse | undefined;

  try {
    payload = (await response.json()) as ErrorResponse;
  } catch {
    payload = undefined;
  }

  return new ApiError(payload?.message ?? `API request failed: ${response.status}`, response.status, payload?.code);
}
