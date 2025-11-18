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
        <li>Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString('fi-FI')}</li>
        <li>Sunset: {new Date(weatherData.sunset * 1000).toLocaleTimeString('fi-FI')}</li>
      </ul>
    </div>
  );
};

export default Weather;