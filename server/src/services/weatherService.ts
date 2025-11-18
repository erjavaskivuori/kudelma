import type { OpenWeatherData, WeatherData } from '../../../shared/types/weather.ts';
import { HttpError } from '../utils/errors/HttpError.js';

export const fetchWeatherByCoordinates = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  const response: Response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`);
  if (!response.ok) {
    throw new HttpError('Failed to fetch weather data', response.status);
  }
  const data: OpenWeatherData = await response.json() as OpenWeatherData;

  const weather: WeatherData = {
    city: data.name,
    main: data.weather[0]?.main,
    temperature: data.main.temp,
    cloudiness: data.clouds.all,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('fi-FI', {
      timeZone: 'Europe/Helsinki'
    }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('fi-FI', {
      timeZone: 'Europe/Helsinki'
    }),
  };

  return weather;
};
