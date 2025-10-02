import { useState, useEffect } from 'react';
import axios from '../utils/apiClient';
import type { WeatherData, Coordinates } from '../../../shared/types/weather';

interface WeatherResponse {
  data: {
    weather: WeatherData;
  };
}

export const useWeather = (coords: Coordinates | null): WeatherData | null => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
  if (!coords) return;

  void (async () => {
    try {
      const response: WeatherResponse = await axios.get('/weather', {
        params: { latitude: coords.lat, longitude: coords.lon }
      });
      setWeather(response.data.weather);
    } catch (error) {
      console.error(error);
    }
  })();
}, [coords]);

  return weather;
};
