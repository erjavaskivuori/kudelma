import type { Request, Response } from 'express';
import { keywordsQuerySchema } from '../utils/schemas/keywordsSchema.js';
import type { KeywordsQuery } from '../utils/schemas/keywordsSchema.js';
import { validate } from '../utils/validate.js';
import { fetchColorsByKeywords } from './colorService.js';

export const getColorPalette = async (req: Request, res: Response) => {
  const validatedQuery = validate<KeywordsQuery>(keywordsQuerySchema, req.query);

  const colorPalette = await fetchColorsByKeywords(validatedQuery.keywords);

  return res.json({ colors: colorPalette });
};
