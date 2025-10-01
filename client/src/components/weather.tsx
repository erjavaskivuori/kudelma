import type { WeatherData } from '../../../shared/types/weather';

const Weather = ({ weather }: { weather: WeatherData | null }) => {
  if (!weather) return <p>No weather data available</p>;
  return (
    <div>
      <p>Weather in {weather.city}:</p>
      <ul>
        <li>Main: {weather.main}</li>
        <li>Temperature: {weather.temperature}°C</li>
        <li>Cloudiness: {weather.cloudiness}%</li>
        <li>Sunrise: {new Date(weather.sunrise * 1000).toLocaleTimeString('fi-FI')}</li>
        <li>Sunset: {new Date(weather.sunset * 1000).toLocaleTimeString('fi-FI')}</li>
      </ul>
    </div>
  )
};

export default Weather;