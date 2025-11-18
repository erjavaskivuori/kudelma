import { useWeather } from '../hooks/useWeather';
import { useGeoLocation } from '../hooks/useGeoLocation';

const Weather = () => {
  const coords = useGeoLocation();
  const weather = useWeather(coords);
  const weatherData = weather.weather;

  if (weather.loading) {
    return <p>Loading weather data...</p>;
  }

  if (weather.error) {
    return <p>Error loading weather: {weather.error}</p>;
  }

  if (!weatherData) {
     return <p>No weather data available</p>;
  }

  return (
    <div>
      <p>Weather in {weatherData.city}:</p>
      <ul>
        <li>Main: {weatherData.main}</li>
        <li>Temperature: {weatherData.temperature}°C</li>
        <li>Cloudiness: {weatherData.cloudiness}%</li>
        <li>Sunrise: {weatherData.sunrise}</li>
        <li>Sunset: {weatherData.sunset}</li>
      </ul>
    </div>
  );
};

export default Weather;