import type { Request, Response } from 'express';
import { fetchImageStream } from '../services/imageProxyService.js';

export const proxyImage = async (req: Request, res: Response): Promise<void> => {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    res.status(400).json({ error: 'Missing image URL' });
    return;
  }

  const { stream, contentType, contentLength } =
    await fetchImageStream(imageUrl);

  res.set({
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=3600',
    ...(contentLength && { 'Content-Length': contentLength }),
  });

  stream.pipe(res);
};
