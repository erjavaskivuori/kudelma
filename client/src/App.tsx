import { useWeather } from './hooks/useWeather';
import { useGeoLocation } from './hooks/useGeoLocation';
import Weather from './components/weather';

const App = () => {
  const coords = useGeoLocation();
  const weather = useWeather(coords);

  return (
    <div>
      <h1>Weather info</h1>
      <Weather weather={weather.weather} loading={weather.loading} error={weather.error} />
    </div>
  );
};

export default App;
