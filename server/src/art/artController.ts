import type { Request, Response } from 'express';
import { fetchArtworksByKeywords } from './artService.js';
import { keywordsQuerySchema } from '../utils/schemas/keywordsSchema.js';
import type { KeywordsQuery } from '../utils/schemas/keywordsSchema.js';
import { validate } from '../utils/validate.js';

export const getArtworks = async (req: Request, res: Response) => {
  const validatedQuery = validate<KeywordsQuery>(keywordsQuerySchema, req.query);

  const artworkData = await fetchArtworksByKeywords(validatedQuery.keywords);

  return res.json({ artworks: artworkData });
};
