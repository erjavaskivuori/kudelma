import type { Request, Response } from 'express';
import { fetchImageStream } from './imageProxyService.js';

type ProxyError = {
  code?: string;
  message: string;
};

export const proxyImage = async (req: Request, res: Response): Promise<void> => {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    res.status(400).json({ error: 'Missing image URL' });
    return;
  }

  try {
    const { stream, contentType, contentLength } = await fetchImageStream(imageUrl);

    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      ...(contentLength && { 'Content-Length': contentLength }),
    });

    stream.on('error', (err: ProxyError) => {
      res.status(502).json({ error: 'Error streaming image', details: err.message });
    });

    stream.pipe(res);
  } catch (error: unknown) {
    const err = (error as ProxyError);
    const code = err.code || '';
    let status = 502;
    let message = 'Failed to fetch image';

    if (code === 'UND_ERR_CONNECT_TIMEOUT') {
      status = 504;
      message = 'Image server timed out';
    } else if (code === 'ENOTFOUND') {
      status = 502;
      message = 'Image server not found';
    } else if (code === 'UND_ERR_SOCKET') {
      status = 502;
      message = 'Connection to image server was closed';
    }

    res.status(status).json({ error: message, details: err.message });
  }
};
