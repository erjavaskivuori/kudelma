import type { Request, Response } from 'express';
import { fetchBooksByKeywords } from './bookService.js';
import { keywordsQuerySchema } from '../utils/schemas/keywordsSchema.js';
import type { KeywordsQuery } from '../utils/schemas/keywordsSchema.js';
import { validate } from '../utils/validate.js';

export const getBooks = async (req: Request, res: Response) => {
  const validatedQuery = validate<KeywordsQuery>(keywordsQuerySchema, req.query);

  const books = await fetchBooksByKeywords(validatedQuery.keywords);

  return res.json({ books });
};
