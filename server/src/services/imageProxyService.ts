import { Readable } from 'stream';
import { HttpError } from '../utils/errors/HttpError.js';

export interface ImageStreamResult {
  stream: NodeJS.ReadableStream;
  contentType: string;
  contentLength?: string;
}

export const fetchImageStream = async (
  imageUrl: string
): Promise<ImageStreamResult> => {
  const response = await fetch(imageUrl);

  if (!response.ok || !response.body) {
    throw new HttpError('Failed to fetch image', response.status);
  }

  const nodeStream = Readable.fromWeb(response.body);
  const contentLength = response.headers.get('content-length');

  return {
    stream: nodeStream,
    contentType: response.headers.get('content-type') ?? 'image/jpeg',
    ...(contentLength && { contentLength }),
  };
};
