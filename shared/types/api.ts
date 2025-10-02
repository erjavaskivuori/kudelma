export interface ErrorResponse {
  error: {
    message: string;
    status: number;
    details?: unknown;
  };
}
