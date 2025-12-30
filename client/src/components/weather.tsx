import type { WeatherData } from '../../../shared/types/weather';

interface WeatherProps {
  weather: WeatherData;
}

const Weather = ({ weather }: WeatherProps) => {
  return (
    <div>
      <p>Weather in {weather.city}:</p>
      <ul>
        <li>Main: {weather.main}</li>
        <li>Temperature: {weather.temperature}°C</li>
        <li>Cloudiness: {weather.cloudiness}%</li>
        <li>Sunrise: {weather.sunrise}</li>
        <li>Sunset: {weather.sunset}</li>
      </ul>
    </div>
  );
};

export default Weather;