import { HttpError } from "./HttpError.js";

export class ValidationError extends HttpError {
  constructor(message = "Validation Error", details?: unknown) {
    super(message, 400, details);
  }
}
