import { HttpError } from '../utils/errors/HttpError.js';
import { redis } from '../infra/redis.js';
import { getNextChangeTimestamp } from '../utils/timeBuckets.js';

const EXPIRE_AT = getNextChangeTimestamp();

export interface Palette {
  id: string;
  colors: string[];
  tags: string[];
  text: string;
  likesCount: number;
  isLiked: boolean;
  normalizedHash: string;
  createdAt: string;
}

export const fetchColorsByKeywords = async (keywords: string[]): Promise<string[]> => {
  const cacheKey = `colors:${keywords.sort().join(',')}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as string[];
  }

  for (let i = 0; i < keywords.length; i++) {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    const keyword = keywords[randomIndex];

    const response: Response = await fetch(`https://colormagic.app/api/palette/search?q=${keyword}`);
    if (!response.ok) {
      throw new HttpError('Failed to fetch color data', response.status);
    }
    const data: Palette[] = await response.json() as Palette[];

    if (data && data[0]) {
      const palette = data[0].colors;
      await redis.set(
        cacheKey, JSON.stringify(palette),
        { expiration: { type:'EXAT', value: EXPIRE_AT } }
      );
      return palette;
    }
  }

  throw new HttpError('No colors found for the given keywords', 404);
};
