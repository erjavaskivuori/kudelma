import type { ZodType } from 'zod';
import { HttpError } from '../utils/errors/HttpError.js';

export const validate = <T>(schema: ZodType<T>, data: unknown): T => {
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    const issues = parseResult.error.issues;
    const errorMessage = issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new HttpError(`Invalid input: ${errorMessage}`, 400);
  }

  return parseResult.data;
};
