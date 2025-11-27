import { HttpError } from '../utils/errors/HttpError.js';

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
  for (let i = 0; i < keywords.length; i++) {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    const keyword = keywords[randomIndex];
    console.log(`Fetching colors for keyword: ${keyword}`);

    const response: Response = await fetch(`https://colormagic.app/api/palette/search?q=${keyword}`);
    if (!response.ok) {
      throw new HttpError('Failed to fetch color data', response.status);
    }
    const data: Palette[] = await response.json() as Palette[];
    console.log(`Received data for keyword: ${keyword}`, data);

    if (data && data[0]) {
      return data[0].colors;
    }
  }

  throw new HttpError('No colors found for the given keywords', 404);
};
