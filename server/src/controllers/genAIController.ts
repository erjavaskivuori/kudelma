import type { Request, Response } from 'express';
import { generateKeywords } from '../services/genAIService.js';
import { HttpError } from '../utils/errors/index.js';

export const getKeywords = async (req: Request, res: Response) => {
  const { city, main, temperature, cloudiness, sunrise, sunset } = req.query;

  if (!city || !main || !temperature || !cloudiness || !sunrise || !sunset) {
    throw new HttpError('Incomplete weather data provided');
  };

  const weather = {
    city: city as string,
    main: main as string,
    temperature: Number(temperature),
    cloudiness: Number(cloudiness),
    sunrise: sunrise as string,
    sunset: sunset as string
  };

  const keywords = await generateKeywords(weather);
  return res.json({ keywords });
};
