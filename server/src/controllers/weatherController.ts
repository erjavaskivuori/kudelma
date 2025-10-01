import type { Request, Response } from 'express';
import { fetchWeatherByCoordinates } from '../services/weatherService.js';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const weatherData = await fetchWeatherByCoordinates(
      parseFloat(latitude as string), 
      parseFloat(longitude as string)
    );
    return res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
