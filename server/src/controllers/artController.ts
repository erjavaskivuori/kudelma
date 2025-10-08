import type { Request, Response } from 'express';
import { fetchArtworksByKeywords } from '../services/artService.js';
import { HttpError } from '../utils/errors/HttpError.js';

export const getArtworks = async (req: Request, res: Response) => {
  const { keywords } = req.query;

  if (keywords === undefined || typeof keywords !== 'string') {
    throw new HttpError('Keywords query parameter is missing or invalid', 400);
  }

  if (!keywords || keywords.trim() === '') {
    throw new HttpError('At least one keyword is required', 400);
  }

  const keywordsArray = keywords?.split(',').map(keyword => keyword.trim()) || [];

  if (keywordsArray.length > 10) {
    throw new HttpError('Maximum 10 keywords allowed', 400);
  } else if (keywordsArray.some(keyword => keyword === '')) {
    throw new HttpError('All keywords must be non-empty strings', 400);
  }

  const artworkData = await fetchArtworksByKeywords(keywordsArray);

  return res.json({ artwork: artworkData });
};
