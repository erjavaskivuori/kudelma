import type { ZodType } from 'zod';
import { HttpError } from '../utils/errors/HttpError.js';

export const validate = <T>(schema: ZodType<T>, data: unknown): T => {
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    const errorMessage = parseResult.error.issues[0]?.message ?? 'Validation failed';
    throw new HttpError(errorMessage, 400);
  }

  return parseResult.data;
};
