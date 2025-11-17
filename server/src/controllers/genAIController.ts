import type { Request, Response } from 'express';
import { generateKeywords } from '../services/genAIService.js';

export const getKeywords = async (_req: Request, res: Response) => {
  const keywords = await generateKeywords();
  return res.json({ keywords });
};
