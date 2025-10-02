import type { Request, Response } from 'express';
import { fetchWeatherByCoordinates } from '../services/weatherService.js';
import { HttpError } from '../utils/errors/HttpError.js';

export const getWeather = async (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    throw new HttpError('Latitude and longitude are required', 400);
  }

  const weatherData = await fetchWeatherByCoordinates(
    parseFloat(latitude as string),
    parseFloat(longitude as string)
  );

  return res.json({ weather: weatherData });
};
